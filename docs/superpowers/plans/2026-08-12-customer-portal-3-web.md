# Müşteri Portalı — Plan 3/3: Web Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the customer-facing portal at `/portal` in `armonitex-web`: httpOnly-cookie session (login/logout via route handlers), route protection, a projects dashboard, a project detail page (financial records + documents), protected document download, and a working password-reset page. Remove open registration.

**Architecture:** Approach A — the browser only ever talks to Next's own same-origin routes. A login **Route Handler** proxies credentials to the API and stores the JWT in an httpOnly cookie. A **`proxy.ts`** (Next 16's renamed middleware) guards `/portal/*`. Portal pages are Server Components that read the cookie and fetch the API server-side via a `serverApi` helper.

**Tech Stack:** Next.js 16 (App Router), React 19, Playwright.

**⚠️ Next 16 breaking changes (verified in `node_modules/next/dist/docs/`):**
- Route protection uses **`proxy.ts`** with an exported `proxy` function + `config.matcher` — `middleware.ts` is **deprecated/renamed** in Next 16.
- `cookies()` from `next/headers` is **async**: `const store = await cookies()`.
- Route Handlers live in `app/**/route.ts` and use Web `Request`/`Response` (or `NextResponse`).

**Design system:** Colors/styles **only** via `globals.css` token classes (`.card-token`, `.btn-primary-token`, `.input-token`, `.form-label-token`, `.text-main-token`, `.text-muted-token`, `.bg-paper-token`, `.eyebrow-token`, `.badge-cyan-token`, `.badge-magenta-token`, `.text-brand-token`, `.bg-white-token`, `.border-token`). Ad-hoc color classes are banned (ADR-0007).

**Prereqs:** Plan 1 (backend) merged. Portal endpoints (`/api/v1/portal/*`), `/auth/reset-password`, and admin data must be reachable.

**Server API base URL:** server-side code reads `process.env.NEXT_PUBLIC_API_URL` (compose sets it to `http://api:8000/api/v1`, reachable from the Next server container). The browser never uses it directly.

**Spec:** `docs/superpowers/specs/2026-08-12-customer-portal-design.md`

**Testing note:** verification is `npm run lint`, `npm run build`, `npm run test:e2e`.

---

## File Structure

**Create:**
- `armonitex-web/src/lib/serverApi.ts` — server-side fetch helper (reads cookie, adds bearer)
- `armonitex-web/src/proxy.ts` — protect `/portal/*`
- `armonitex-web/src/app/api/auth/login/route.ts` — POST: proxy login, set cookie
- `armonitex-web/src/app/api/auth/logout/route.ts` — POST: clear cookie
- `armonitex-web/src/app/portal/layout.tsx` — portal shell
- `armonitex-web/src/app/portal/page.tsx` — dashboard (projects)
- `armonitex-web/src/app/portal/projeler/[id]/page.tsx` — project detail
- `armonitex-web/src/app/portal/dokuman/[id]/route.ts` — download proxy
- `armonitex-web/src/app/auth/reset-password/page.tsx` — reset form
- `armonitex-web/tests/e2e/portal.spec.ts` — e2e

**Modify:**
- `armonitex-web/src/app/auth/login/page.tsx` — post to route handler, show errors, drop register link
- `armonitex-web/src/components/Header.tsx` — add a "Portal" / login link (optional nav)

**Delete:**
- `armonitex-web/src/app/auth/register/page.tsx` — open registration closed

---

## Task 1: Server API helper

**Files:**
- Create: `armonitex-web/src/lib/serverApi.ts`

- [ ] **Step 1: Implement helper**

```typescript
import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://api:8000/api/v1";
export const SESSION_COOKIE = "access_token";

export class UnauthorizedError extends Error {}

async function authHeader(): Promise<Record<string, string>> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** GET a portal endpoint server-side. Throws UnauthorizedError on 401/403. */
export async function serverGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { ...(await authHeader()) },
    cache: "no-store",
  });
  if (res.status === 401 || res.status === 403) {
    throw new UnauthorizedError();
  }
  if (!res.ok) {
    throw new Error(`API ${res.status} for ${path}`);
  }
  return (await res.json()) as T;
}

export function apiBase(): string {
  return API_BASE;
}
```

- [ ] **Step 2: Commit**

```bash
git add armonitex-web/src/lib/serverApi.ts
git commit -m "feat(web): server-side API helper with cookie-based auth"
```

---

## Task 2: Login + logout route handlers

**Files:**
- Create: `armonitex-web/src/app/api/auth/login/route.ts`
- Create: `armonitex-web/src/app/api/auth/logout/route.ts`

- [ ] **Step 1: Login route**

```typescript
import { cookies } from "next/headers";

import { apiBase, SESSION_COOKIE } from "@/lib/serverApi";

const MAX_AGE_SECONDS = 60 * 30; // matches backend access-token TTL

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as {
    email?: string;
    password?: string;
  };
  if (!email || !password) {
    return Response.json({ detail: "E-posta ve şifre zorunludur." }, { status: 400 });
  }

  const body = new URLSearchParams();
  body.append("username", email);
  body.append("password", password);

  const res = await fetch(`${apiBase()}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    cache: "no-store",
  });

  if (!res.ok) {
    return Response.json({ detail: "E-posta veya şifre hatalı." }, { status: 401 });
  }

  const data = (await res.json()) as { access_token: string };
  (await cookies()).set(SESSION_COOKIE, data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });

  return Response.json({ ok: true });
}
```

- [ ] **Step 2: Logout route**

```typescript
import { cookies } from "next/headers";

import { SESSION_COOKIE } from "@/lib/serverApi";

export async function POST() {
  (await cookies()).delete(SESSION_COOKIE);
  return Response.json({ ok: true });
}
```

- [ ] **Step 3: Commit**

```bash
git add armonitex-web/src/app/api/auth
git commit -m "feat(web): login/logout route handlers with httpOnly session cookie"
```

---

## Task 3: Route protection via proxy.ts

**Files:**
- Create: `armonitex-web/src/proxy.ts`

- [ ] **Step 1: Implement proxy (Next 16 renamed middleware)**

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE = "access_token";

export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(SESSION_COOKIE);
  if (!hasSession) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/portal/:path*",
};
```

- [ ] **Step 2: Verify it compiles / lints**

Run: `cd armonitex-web && npm run lint`
Expected: no errors for `src/proxy.ts`.

- [ ] **Step 3: Commit**

```bash
git add armonitex-web/src/proxy.ts
git commit -m "feat(web): protect /portal via proxy.ts (Next 16)"
```

---

## Task 4: Portal layout (shell + logout)

**Files:**
- Create: `armonitex-web/src/app/portal/layout.tsx`

- [ ] **Step 1: Implement layout**

```tsx
import Link from "next/link";

import Logo from "@/components/Logo";
import { serverGet, UnauthorizedError } from "@/lib/serverApi";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";

type Me = { full_name: string | null; email: string };

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  let me: Me;
  try {
    me = await serverGet<Me>("/portal/me");
  } catch (error) {
    if (error instanceof UnauthorizedError) redirect("/auth/login?next=/portal");
    throw error;
  }

  return (
    <div className="min-h-screen bg-paper-token text-main-token font-sans">
      <header className="bg-white-token border-b border-token">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <Link href="/portal" className="flex items-center gap-3">
            <Logo className="h-8" />
            <span className="eyebrow-token">Müşteri Portalı</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-token">{me.full_name ?? me.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
```

- [ ] **Step 2: Logout button (client component)**

Create `armonitex-web/src/app/portal/LogoutButton.tsx`:

```tsx
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const logout = async () => {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <button onClick={logout} disabled={busy} className="btn-secondary-token">
      {busy ? "Çıkış yapılıyor..." : "Çıkış"}
    </button>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add armonitex-web/src/app/portal/layout.tsx armonitex-web/src/app/portal/LogoutButton.tsx
git commit -m "feat(web): portal layout shell with session guard and logout"
```

---

## Task 5: Dashboard — projects list

**Files:**
- Create: `armonitex-web/src/app/portal/page.tsx`

- [ ] **Step 1: Shared status badge helper**

Create `armonitex-web/src/app/portal/statusLabels.ts`:

```typescript
export const PROJECT_STATUS_LABELS: Record<string, string> = {
  teklif: "Teklif",
  onaylandi: "Onaylandı",
  uretimde: "Üretimde",
  tamamlandi: "Tamamlandı",
  iptal: "İptal",
};

export const FINANCIAL_STATUS_LABELS: Record<string, string> = {
  bekliyor: "Bekliyor",
  onaylandi: "Onaylandı",
  reddedildi: "Reddedildi",
  odendi: "Ödendi",
  gecikti: "Gecikti",
};

export const FINANCIAL_TYPE_LABELS: Record<string, string> = {
  quote: "Teklif",
  invoice: "Fatura",
};
```

- [ ] **Step 2: Dashboard page**

```tsx
import Link from "next/link";

import { serverGet, UnauthorizedError } from "@/lib/serverApi";
import { redirect } from "next/navigation";
import { PROJECT_STATUS_LABELS } from "./statusLabels";

type Project = {
  id: string;
  title: string;
  reference_no: string | null;
  status: string;
  created_at: string;
};
type Page<T> = { data: T[]; total: number };

export default async function PortalDashboard() {
  let projects: Project[];
  try {
    const page = await serverGet<Page<Project>>("/portal/projects?page_size=100");
    projects = page.data;
  } catch (error) {
    if (error instanceof UnauthorizedError) redirect("/auth/login?next=/portal");
    throw error;
  }

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-main-token">Projelerim</h1>

      {projects.length === 0 ? (
        <p className="text-muted-token">Henüz görüntülenecek bir projeniz yok.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((p) => (
            <Link key={p.id} href={`/portal/projeler/${p.id}`} className="card-token bg-white-token p-5 block rise-token">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-main-token">{p.title}</h2>
                <span className="badge-cyan-token">{PROJECT_STATUS_LABELS[p.status] ?? p.status}</span>
              </div>
              {p.reference_no ? (
                <p className="text-subtle-token text-sm mt-1">Ref: {p.reference_no}</p>
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add armonitex-web/src/app/portal/page.tsx armonitex-web/src/app/portal/statusLabels.ts
git commit -m "feat(web): portal dashboard listing customer projects"
```

---

## Task 6: Project detail — financial records + documents

**Files:**
- Create: `armonitex-web/src/app/portal/projeler/[id]/page.tsx`

- [ ] **Step 1: Implement the page**

Note: `params` is a Promise in this Next version — `await params`.

```tsx
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { serverGet, UnauthorizedError } from "@/lib/serverApi";
import {
  FINANCIAL_STATUS_LABELS,
  FINANCIAL_TYPE_LABELS,
  PROJECT_STATUS_LABELS,
} from "../../statusLabels";

type Project = {
  id: string;
  title: string;
  description: string | null;
  reference_no: string | null;
  status: string;
};
type FinancialRecord = {
  id: string;
  type: string;
  number: string;
  amount: string;
  currency: string;
  status: string;
  issue_date: string | null;
  due_date: string | null;
  document_id: string | null;
};
type DocumentItem = {
  id: string;
  original_filename: string;
  size_bytes: number;
};
type Page<T> = { data: T[]; total: number };

class NotFoundError extends Error {}

async function loadProject(id: string): Promise<Project> {
  const res = await serverGet<Project>(`/portal/projects/${id}`).catch((e) => {
    if (e instanceof UnauthorizedError) throw e;
    throw new NotFoundError();
  });
  return res;
}

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let project: Project;
  let records: FinancialRecord[];
  let documents: DocumentItem[];
  try {
    project = await loadProject(id);
    records = (await serverGet<Page<FinancialRecord>>(
      `/portal/financial-records?project_id=${id}&page_size=100`,
    )).data;
    documents = (await serverGet<Page<DocumentItem>>(
      `/portal/documents?project_id=${id}&page_size=100`,
    )).data;
  } catch (error) {
    if (error instanceof UnauthorizedError) redirect("/auth/login?next=/portal");
    if (error instanceof NotFoundError) notFound();
    throw error;
  }

  return (
    <section className="space-y-8">
      <div className="space-y-2">
        <Link href="/portal" className="text-brand-token text-sm hover:underline">
          ← Projelerim
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-main-token">{project.title}</h1>
          <span className="badge-cyan-token">
            {PROJECT_STATUS_LABELS[project.status] ?? project.status}
          </span>
        </div>
        {project.description ? <p className="text-muted-token">{project.description}</p> : null}
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-main-token">Teklif & Faturalar</h2>
        {records.length === 0 ? (
          <p className="text-muted-token">Kayıt yok.</p>
        ) : (
          <div className="card-token bg-white-token divide-y divide-token">
            {records.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-main-token">
                    {FINANCIAL_TYPE_LABELS[r.type] ?? r.type} · {r.number}
                  </p>
                  <p className="text-subtle-token text-sm">
                    {r.amount} {r.currency}
                    {r.due_date ? ` · Vade: ${r.due_date}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="badge-magenta-token">
                    {FINANCIAL_STATUS_LABELS[r.status] ?? r.status}
                  </span>
                  {r.document_id ? (
                    <a className="text-brand-token text-sm hover:underline" href={`/portal/dokuman/${r.document_id}`}>
                      PDF
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-main-token">Dokümanlar</h2>
        {documents.length === 0 ? (
          <p className="text-muted-token">Doküman yok.</p>
        ) : (
          <div className="card-token bg-white-token divide-y divide-token">
            {documents.map((d) => (
              <div key={d.id} className="flex items-center justify-between p-4">
                <span className="text-main-token">{d.original_filename}</span>
                <a className="btn-secondary-token" href={`/portal/dokuman/${d.id}`}>
                  İndir
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add armonitex-web/src/app/portal/projeler
git commit -m "feat(web): project detail with financial records and documents"
```

---

## Task 7: Document download proxy

**Files:**
- Create: `armonitex-web/src/app/portal/dokuman/[id]/route.ts`

- [ ] **Step 1: Implement the streaming proxy**

```typescript
import { cookies } from "next/headers";

import { apiBase, SESSION_COOKIE } from "@/lib/serverApi";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/portal/dokuman/[id]">,
) {
  const { id } = await ctx.params;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const upstream = await fetch(`${apiBase()}/portal/documents/${id}/download`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!upstream.ok || !upstream.body) {
    return new Response("Not found", { status: upstream.status || 404 });
  }

  const headers = new Headers();
  const contentType = upstream.headers.get("content-type");
  const disposition = upstream.headers.get("content-disposition");
  if (contentType) headers.set("content-type", contentType);
  if (disposition) headers.set("content-disposition", disposition);

  return new Response(upstream.body, { status: 200, headers });
}
```

(If `RouteContext` type generation lags, use `ctx: { params: Promise<{ id: string }> }` instead.)

- [ ] **Step 2: Commit**

```bash
git add armonitex-web/src/app/portal/dokuman
git commit -m "feat(web): authenticated document download proxy"
```

---

## Task 8: Update login page; add reset-password; remove register

**Files:**
- Modify: `armonitex-web/src/app/auth/login/page.tsx`
- Create: `armonitex-web/src/app/auth/reset-password/page.tsx`
- Delete: `armonitex-web/src/app/auth/register/page.tsx`

- [ ] **Step 1: Rewrite login page to use the route handler + show errors**

Replace `armonitex-web/src/app/auth/login/page.tsx` with:

```tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/portal";

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });
      if (res.ok) {
        router.push(next);
        router.refresh();
      } else {
        const body = (await res.json().catch(() => ({}))) as { detail?: string };
        setError(body.detail ?? "Giriş başarısız.");
      }
    } catch {
      setError("Sunucuya ulaşılamadı.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-center text-2xl font-semibold tracking-tight text-main-token">
          Hesabınıza Giriş Yapın
        </h2>
      </div>

      {error ? (
        <p className="badge-magenta-token block text-center" role="alert">
          {error}
        </p>
      ) : null}

      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label className="form-label-token">E-posta</label>
          <input
            name="email"
            type="email"
            required
            className="input-token mt-1"
            placeholder="ornek@armonitex.com"
          />
        </div>

        <div>
          <label className="form-label-token">Şifre</label>
          <input
            name="password"
            type="password"
            required
            className="input-token mt-1"
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center justify-end text-sm">
          <Link href="/auth/forgot-password" className="font-semibold text-brand-token hover:underline">
            Şifremi unuttum
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary-token w-full justify-center disabled:opacity-50"
        >
          {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
}
```

(The "Hesap oluştur" link is intentionally removed — registration is admin-only now.)

- [ ] **Step 2: Create reset-password page**

`armonitex-web/src/app/auth/reset-password/page.tsx`:

```tsx
"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("password") as string;
    if (newPassword.length < 12) {
      setError("Şifre en az 12 karakter olmalıdır.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPassword }),
      });
      if (res.ok) {
        setDone(true);
        setTimeout(() => router.push("/auth/login"), 1500);
      } else {
        const body = (await res.json().catch(() => ({}))) as { detail?: string };
        setError(body.detail ?? "Şifre sıfırlanamadı.");
      }
    } catch {
      setError("Sunucuya ulaşılamadı.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return <p className="text-muted-token text-center">Geçersiz bağlantı.</p>;
  }
  if (done) {
    return <p className="text-center text-main-token">Şifreniz güncellendi. Yönlendiriliyorsunuz…</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-center text-2xl font-semibold tracking-tight text-main-token">
        Yeni Şifre Belirleyin
      </h2>
      {error ? (
        <p className="badge-magenta-token block text-center" role="alert">
          {error}
        </p>
      ) : null}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="form-label-token">Yeni Şifre</label>
          <input name="password" type="password" required minLength={12} className="input-token mt-1" placeholder="••••••••" />
        </div>
        <button type="submit" disabled={isLoading} className="btn-primary-token w-full justify-center disabled:opacity-50">
          {isLoading ? "Kaydediliyor..." : "Şifreyi Güncelle"}
        </button>
      </form>
      <p className="text-center text-sm">
        <Link href="/auth/login" className="text-brand-token hover:underline">Girişe dön</Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="text-muted-token text-center">Yükleniyor…</p>}>
      <ResetForm />
    </Suspense>
  );
}
```

(Note: this page posts directly to the API. In the Docker network the browser cannot reach `http://api:8000`; for local dev the API is on `http://localhost:8080/api/v1`. If `NEXT_PUBLIC_API_URL` is the internal URL, add a thin `app/api/auth/reset-password/route.ts` proxy mirroring the login route. Decide during implementation based on the deployment's public API URL; the login/portal flows already avoid this by being server-side.)

- [ ] **Step 3: Delete the register page**

```bash
git rm armonitex-web/src/app/auth/register/page.tsx
```

Then grep for any remaining links to `/auth/register` and remove them:
Run: `cd armonitex-web && npx --yes rg -n "auth/register" src || echo "no references"`
Expected: `no references` (the login-page link was already removed in Step 1).

- [ ] **Step 4: Commit**

```bash
git add armonitex-web/src/app/auth
git commit -m "feat(web): cookie login flow, reset-password page; remove open registration"
```

---

## Task 9: E2E test

**Files:**
- Create: `armonitex-web/tests/e2e/portal.spec.ts`

- [ ] **Step 1: Inspect an existing spec for base URL / helpers**

Run: `cd armonitex-web && cat tests/e2e/admin-integration.spec.ts | head -40`
Expected: note the `baseURL`/config conventions used (Playwright `test`, `expect`, any `request` fixture) and reuse them.

- [ ] **Step 2: Write the spec**

Seeds data through the admin API, then drives the browser as the customer. Assumes env `E2E_ADMIN_EMAIL`/`E2E_ADMIN_PASSWORD` for a superuser and `API_URL` (default `http://localhost:8080/api/v1`).

```typescript
import { expect, test } from "@playwright/test";

const API = process.env.API_URL ?? "http://localhost:8080/api/v1";
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? "admin@armonitex.com.tr";
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "change-me-please";

test("unauthenticated /portal redirects to login", async ({ page }) => {
  await page.goto("/portal");
  await expect(page).toHaveURL(/\/auth\/login/);
});

test("customer sees seeded project, records and documents", async ({ page, request }) => {
  // 1) admin token
  const tokenRes = await request.post(`${API}/auth/token`, {
    form: { username: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  });
  expect(tokenRes.ok()).toBeTruthy();
  const adminToken = (await tokenRes.json()).access_token as string;
  const auth = { Authorization: `Bearer ${adminToken}` };

  // 2) seed a unique customer (email suffixed to stay idempotent-ish per run)
  const email = `e2e-${Date.now()}@example.com`;
  const password = "customer-pass-123";
  const custRes = await request.post(`${API}/admin/users`, {
    headers: auth,
    data: { email, full_name: "E2E Müşteri", password, is_customer: true },
  });
  expect(custRes.ok()).toBeTruthy();
  const customerId = (await custRes.json()).id as string;

  const projRes = await request.post(`${API}/admin/projects`, {
    headers: auth,
    data: { customer_id: customerId, title: "E2E Proje", status: "uretimde" },
  });
  expect(projRes.ok()).toBeTruthy();
  const projectId = (await projRes.json()).id as string;

  await request.post(`${API}/admin/financial-records`, {
    headers: auth,
    data: { project_id: projectId, type: "quote", number: "TKL-E2E", amount: "1500.00", status: "bekliyor" },
  });

  // 3) log in as the customer through the UI
  await page.goto("/auth/login");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/portal/);

  // 4) dashboard shows the project; detail shows the record
  await expect(page.getByText("E2E Proje")).toBeVisible();
  await page.getByText("E2E Proje").click();
  await expect(page).toHaveURL(new RegExp(`/portal/projeler/${projectId}`));
  await expect(page.getByText("TKL-E2E")).toBeVisible();
});
```

- [ ] **Step 3: Run e2e**

Run: `cd armonitex-web && npm run test:e2e -- portal.spec.ts`
Expected: both tests pass against a running stack (`docker compose up -d` with the superuser bootstrapped, per Plan 1 Task 14).

- [ ] **Step 4: Commit**

```bash
git add armonitex-web/tests/e2e/portal.spec.ts
git commit -m "test(web): e2e for portal login and project detail"
```

---

## Task 10: Full build + lint verification

**Files:** none

- [ ] **Step 1: Lint**

Run: `cd armonitex-web && npm run lint`
Expected: no errors (especially: no ad-hoc color classes — token classes only).

- [ ] **Step 2: Build**

Run: `cd armonitex-web && npm run build`
Expected: build succeeds; `/portal`, `/portal/projeler/[id]`, route handlers, and `proxy.ts` compile.

- [ ] **Step 3: Manual smoke (running stack)**

Run: `docker compose up -d`. Visit `http://localhost:3005/portal` unauthenticated → redirected to `/auth/login`. Log in as a seeded customer → dashboard → project detail → download a document. Log out → `/portal` again redirects.

- [ ] **Step 4: Record results and stop**

Do not mark complete unless lint, build, and the manual smoke all pass.

---

## Self-Review (completed during planning)

- **Spec coverage:** session §6.1 → Tasks 1–3; pages §6.2 → Tasks 4–7; login/register/reset §6.3 → Task 8; e2e §8 → Task 9. All covered.
- **Next 16 correctness:** uses `proxy.ts` (not `middleware.ts`), `await cookies()`, `await params`, route handlers under `app/**/route.ts` — all verified against `node_modules/next/dist/docs/`.
- **Type consistency:** `SESSION_COOKIE` constant defined in `serverApi.ts` and reused; `proxy.ts` repeats the literal `"access_token"` because proxy must avoid shared-module reliance (per Next proxy "Good to know") — the value is identical and noted here intentionally.
- **Security:** cookie is httpOnly + SameSite=Lax + Secure in production; browser never holds the JWT; downloads proxied server-side with ownership enforced by the backend (Plan 1).
- **Open item flagged (not a placeholder):** the reset-password page posts to the API directly; Task 8 Step 2 documents adding a route-handler proxy if the public API URL isn't browser-reachable — a deployment-dependent decision, explicitly called out.
```

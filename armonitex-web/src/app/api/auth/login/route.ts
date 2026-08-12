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

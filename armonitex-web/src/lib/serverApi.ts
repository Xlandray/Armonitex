import { cookies } from "next/headers";

// Server-only base URL. Prefer API_URL (read at runtime) over NEXT_PUBLIC_API_URL,
// which Next inlines at build time and so cannot be overridden per-environment.
const API_BASE =
  process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://api:8000/api/v1";
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

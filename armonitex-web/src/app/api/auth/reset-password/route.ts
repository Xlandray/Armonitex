import { apiBase } from "@/lib/serverApi";

export async function POST(request: Request) {
  const { token, new_password } = (await request.json()) as {
    token?: string;
    new_password?: string;
  };
  if (!token || !new_password) {
    return Response.json({ detail: "Eksik bilgi." }, { status: 400 });
  }

  const res = await fetch(`${apiBase()}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, new_password }),
    cache: "no-store",
  });

  const body = (await res.json().catch(() => ({}))) as { detail?: string; message?: string };
  return Response.json(body, { status: res.status });
}

import { cookies } from "next/headers";

import { apiBase, SESSION_COOKIE } from "@/lib/serverApi";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ id: string }> },
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

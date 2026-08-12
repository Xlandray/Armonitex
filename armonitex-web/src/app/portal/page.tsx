import Link from "next/link";
import { redirect } from "next/navigation";

import { serverGet, UnauthorizedError } from "@/lib/serverApi";
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
            <Link
              key={p.id}
              href={`/portal/projeler/${p.id}`}
              className="card-token bg-white-token p-5 block rise-token"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-main-token">{p.title}</h2>
                <span className="badge-cyan-token">
                  {PROJECT_STATUS_LABELS[p.status] ?? p.status}
                </span>
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

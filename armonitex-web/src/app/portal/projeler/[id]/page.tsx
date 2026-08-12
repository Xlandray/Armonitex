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

export default async function ProjectDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let project: Project;
  let records: FinancialRecord[];
  let documents: DocumentItem[];
  try {
    project = await serverGet<Project>(`/portal/projects/${id}`);
    records = (
      await serverGet<Page<FinancialRecord>>(
        `/portal/financial-records?project_id=${id}&page_size=100`,
      )
    ).data;
    documents = (
      await serverGet<Page<DocumentItem>>(`/portal/documents?project_id=${id}&page_size=100`)
    ).data;
  } catch (error) {
    if (error instanceof UnauthorizedError) redirect("/auth/login?next=/portal");
    // A missing or non-owned project returns 404 from the API.
    notFound();
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
                    <a
                      className="text-brand-token text-sm hover:underline"
                      href={`/portal/dokuman/${r.document_id}`}
                    >
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

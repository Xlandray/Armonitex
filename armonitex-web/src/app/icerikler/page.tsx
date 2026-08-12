import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Haberler & Projeler",
  description: "Armonitex tarafından tamamlanan dijital baskı projeleri, hammadde teknolojileri ve sektör haberleri.",
  alternates: {
    canonical: "/icerikler",
  },
  openGraph: {
    title: "Haberler & Projeler | Armonitex Dijital Baskı",
    description: "Tamamlanan açıkhava reklam projelerimiz ve sektör duyurularımız.",
    url: "https://armonitex.com.tr/icerikler",
  },
};

interface Content {
  id: string;
  title: string;
  slug: string;
  body: string;
  is_published: boolean;
  created_at?: string;
}

async function getPublishedContents(): Promise<Content[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contents`, {
      next: { revalidate: 60 },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) return [];
    const contents: Content[] = await res.json();
    return contents.filter((c) => c.is_published);
  } catch {
    return [];
  }
}

export default async function ContentsListingPage() {
  const contents = await getPublishedContents();

  return (
    <div className="min-h-screen bg-white-token flex flex-col font-sans text-main-token">
      <Header />

      <section className="relative bg-navy-gradient-token overflow-hidden border-b border-on-navy-token">
        <div className="absolute inset-0 bg-grid-navy-token pointer-events-none" aria-hidden />
        <span className="reg-cross-navy-token absolute top-8 left-8 hidden sm:block" aria-hidden />
        <span className="reg-cross-navy-token absolute bottom-8 right-8 hidden sm:block" aria-hidden />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-5">
          <div className="flex justify-center items-center gap-2 label-mono-navy-token">
            <span className="reg-cross-token" aria-hidden />
            Bilgi Merkezi · Arşiv
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white-token">
            Haberler &amp; <span className="text-brand-token">Tamamlanan Projeler</span>
          </h1>
          <p className="text-on-navy-muted text-base max-w-xl mx-auto leading-relaxed">
            1998&apos;den bu yana imza attığımız büyük ölçekli açıkhava baskı projeleri ve sektör
            gelişmeleri.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {contents.length === 0 ? (
          <div className="bg-paper-token p-16 rounded-2xl border border-token text-center space-y-3 flex flex-col items-center">
            <span className="reg-cross-token" aria-hidden />
            <h2 className="font-display text-lg font-semibold text-main-token">
              Henüz yayınlanmış bir haber bulunmuyor.
            </h2>
            <p className="text-sm text-subtle-token">Çok yakında yeni proje duyurularımız eklenecektir.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contents.map((content, i) => (
              <article
                key={content.id}
                className="card-token group p-6 flex flex-col justify-between bg-white-token"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="badge-cyan-token">SEKTÖREL YAYIN</span>
                    <span className="font-mono text-xs text-muted-token">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-bold text-main-token mb-3 group-hover:text-brand-token transition-colors">
                    {content.title}
                  </h2>
                  <p className="text-subtle-token text-sm line-clamp-4 mb-6 leading-relaxed">
                    {content.body}
                  </p>
                </div>

                <Link
                  href={`/icerik/${content.slug}`}
                  className="inline-flex items-center gap-1 font-display text-sm font-semibold text-brand-token pt-4 border-t border-token"
                >
                  Devamını Oku
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

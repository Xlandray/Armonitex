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

      <section className="bg-white-token border-b border-token">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 text-center space-y-4">
          <p className="eyebrow-token">Bilgi Merkezi</p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-main-token">
            Haberler &amp; <span className="text-brand-token">tamamlanan projeler</span>
          </h1>
          <p className="text-lg text-subtle-token max-w-xl mx-auto leading-relaxed">
            1998&apos;den bu yana imza attığımız büyük ölçekli açıkhava baskı projeleri ve sektör
            gelişmeleri.
          </p>
        </div>
      </section>

      <main className="flex-1 bg-paper-token">
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {contents.length === 0 ? (
            <div className="bg-white-token p-16 rounded-2xl border border-token text-center">
              <h2 className="text-lg font-semibold text-main-token">
                Henüz yayınlanmış bir haber bulunmuyor.
              </h2>
              <p className="mt-2 text-sm text-subtle-token">
                Çok yakında yeni proje duyurularımız eklenecektir.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contents.map((content) => (
                <article
                  key={content.id}
                  className="card-token group p-8 flex flex-col justify-between bg-white-token"
                >
                  <div>
                    <span className="badge-cyan-token">Sektörel Yayın</span>
                    <h2 className="mt-4 text-lg font-semibold text-main-token group-hover:text-brand-token transition-colors">
                      {content.title}
                    </h2>
                    <p className="mt-2 text-subtle-token text-sm line-clamp-4 leading-relaxed">
                      {content.body}
                    </p>
                  </div>

                  <Link
                    href={`/icerik/${content.slug}`}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-token"
                  >
                    Devamını Oku
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

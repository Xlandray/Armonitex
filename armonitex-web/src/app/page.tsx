import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArchitectureTabs from "@/components/ArchitectureTabs";
import Link from "next/link";

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

export default async function HomePage() {
  const contents = await getPublishedContents();

  // SSS (FAQ) Schema.org Structured Data
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Armonitex hangi dijital baskı ve reklam hizmetlerini sunuyor?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "1998'den bu yana iç mekan dijital baskı, dış mekan vinil ve mesh baskı, ışıklı/ışıksız tabela imalatı, araç giydirme ve fuar display sistemleri imalatı sunmaktayız."
        }
      },
      {
        "@type": "Question",
        name: "Dijital baskı siparişlerinde teslim süresi ne kadardır?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Kendi bünyemizdeki yüksek kapasiteli makine parkurumuz sayesinde standart baskı işleri 24-48 saat içerisinde tamamlanıp teslim edilmektedir."
        }
      },
      {
        "@type": "Question",
        name: "Online fiyat teklifi nasıl alabilirim?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Web sitemizdeki 'İletişim & Teklif Alın' sayfasındaki formu doldurarak projenizin ölçü ve detaylarını iletebilir, uzman ekibimizden anında fiyat teklifi alabilirsiniz."
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white-token flex flex-col font-sans text-main-token">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />

      {/* Real Armonitex Hero Section */}
      <section className="bg-white-token border-b border-token py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="flex justify-center items-center gap-3 flex-wrap">
            <span className="badge-magenta-token font-bold uppercase tracking-wider">
              UPDATE Açıkhava Çözümleri
            </span>
            <span className="badge-cyan-token font-bold uppercase tracking-wider">
              1998&apos;den Beri Armonitex Güvencesi
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-main-token tracking-tight leading-tight">
            Yüksek Kalitede <br className="hidden sm:inline" />
            <span className="text-brand-token">Dijital Baskı &amp; Açıkhava Çözümleri</span>
          </h1>

          <p className="text-lg sm:text-xl text-subtle-token max-w-3xl mx-auto leading-relaxed">
            Armoni Reklam &amp; UPD Reklam güvencesiyle iç mekan, dış mekan dijital baskı, ışıklı/ışıksız tabela, cephe giydirme ve fuar display ürünlerinde 28 yıllık tecrübemizle hizmetinizdeyiz.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link href="/iletisim" className="btn-primary-token text-base px-6 py-3">
              Hızlı Teklif Alın →
            </Link>
            <Link href="/kurumsal" className="btn-secondary-token text-base px-6 py-3">
              Hakkımızda &amp; Kurumsal
            </Link>
          </div>
        </div>
      </section>

      {/* Production Metrics Bar */}
      <section className="bg-white-token border-b border-token py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="p-4 rounded-lg bg-white-token border-2 border-cyan-token shadow-xs">
            <div className="text-3xl font-extrabold text-brand-token font-mono">1998&apos;den</div>
            <div className="text-xs text-subtle-token font-bold uppercase tracking-wider mt-1">Beri Sektör Lideri</div>
          </div>
          <div className="p-4 rounded-lg bg-white-token border-2 border-cyan-token shadow-xs">
            <div className="text-3xl font-extrabold text-brand-token font-mono">50.000+</div>
            <div className="text-xs text-subtle-token font-bold uppercase tracking-wider mt-1">Tamamlanan Proje</div>
          </div>
          <div className="p-4 rounded-lg bg-white-token border-2 border-cyan-token shadow-xs">
            <div className="text-3xl font-extrabold text-brand-token font-mono">%100</div>
            <div className="text-xs text-subtle-token font-bold uppercase tracking-wider mt-1">Müşteri Memnuniyeti</div>
          </div>
          <div className="p-4 rounded-lg bg-white-token border-2 border-cyan-token shadow-xs">
            <div className="text-3xl font-extrabold text-brand-token font-mono">7/24</div>
            <div className="text-xs text-subtle-token font-bold uppercase tracking-wider mt-1">Kesintisiz İmalat</div>
          </div>
        </div>
      </section>

      {/* Products & Services Grid */}
      <section className="bg-white-token py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-token">Hizmet Alanlarımız</span>
          <h2 className="text-3xl font-extrabold text-main-token">Baskı ve Açıkhava Çözümlerimiz</h2>
          <p className="text-subtle-token text-base">
            Modern baskı parkurumuz ve uzman ekibimizle markanız için ürettiğimiz temel çözümler.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Link href="/hizmet/ic-mekan-dijital-baski" className="card-token p-6 space-y-4 bg-white-token hover:border-cyan-token transition-all">
            <div className="w-10 h-10 rounded-md bg-cyan-soft-token text-brand-token flex items-center justify-center text-sm font-bold font-mono border border-cyan-token">
              01
            </div>
            <h3 className="text-xl font-bold text-main-token">İç Mekan Baskı</h3>
            <p className="text-subtle-token text-sm leading-relaxed">
              Poster, afiş, kanvas tablo, duratrans, fotoblok ve yüksek çözünürlüklü iç mekan grafik baskıları.
            </p>
          </Link>

          <Link href="/hizmet/dis-mekan-vinil-baski" className="card-token p-6 space-y-4 bg-white-token hover:border-cyan-token transition-all">
            <div className="w-10 h-10 rounded-md bg-cyan-soft-token text-brand-token flex items-center justify-center text-sm font-bold font-mono border border-cyan-token">
              02
            </div>
            <h3 className="text-xl font-bold text-main-token">Dış Mekan Baskı</h3>
            <p className="text-subtle-token text-sm leading-relaxed">
              Vinil (branda) baskı, mesh (delikli) baskı, bina cephe giydirme ve araç giydirme uygulamaları.
            </p>
          </Link>

          <Link href="/hizmet/isikli-tabela-totem" className="card-token p-6 space-y-4 bg-white-token hover:border-cyan-token transition-all">
            <div className="w-10 h-10 rounded-md bg-cyan-soft-token text-brand-token flex items-center justify-center text-sm font-bold font-mono border border-cyan-token">
              03
            </div>
            <h3 className="text-xl font-bold text-main-token">Tabela &amp; Totem</h3>
            <p className="text-subtle-token text-sm leading-relaxed">
              Işıklı/ışıksız tabela imalatı, pleksi kutu harf, totem tabelalar ve iç mekan yönlendirme sistemleri.
            </p>
          </Link>

          <Link href="/hizmet/display-sistemleri" className="card-token p-6 space-y-4 bg-white-token hover:border-cyan-token transition-all">
            <div className="w-10 h-10 rounded-md bg-cyan-soft-token text-brand-token flex items-center justify-center text-sm font-bold font-mono border border-cyan-token">
              04
            </div>
            <h3 className="text-xl font-bold text-main-token">Display Sistemleri</h3>
            <p className="text-subtle-token text-sm leading-relaxed">
              Roll-up stand, örümcek stand, plaj bayrağı, flama ve fuar tanıtım panoları imalatı.
            </p>
          </Link>
        </div>

        {/* Interactive Production Standards Tabs */}
        <ArchitectureTabs />
      </section>

      {/* SSS (FAQ) Section - High SEO Ranking Impact */}
      <section className="bg-white-token py-16 px-4 sm:px-6 lg:px-8 border-t border-token">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-token">Bilgi Merkezi</span>
            <h2 className="text-3xl font-extrabold text-main-token">Sıkça Sorulan Sorular</h2>
          </div>

          <div className="space-y-4">
            <div className="card-token p-6 bg-white-token border-2 border-cyan-token">
              <h3 className="text-lg font-bold text-main-token mb-2">Armonitex hangi dijital baskı ve reklam hizmetlerini sunuyor?</h3>
              <p className="text-subtle-token text-sm leading-relaxed">
                1998&apos;den bu yana iç mekan dijital baskı, dış mekan vinil ve mesh baskı, ışıklı/ışıksız tabela imalatı, araç giydirme ve fuar display sistemleri imalatı sunmaktayız.
              </p>
            </div>

            <div className="card-token p-6 bg-white-token border-2 border-cyan-token">
              <h3 className="text-lg font-bold text-main-token mb-2">Dijital baskı siparişlerinde teslim süresi ne kadardır?</h3>
              <p className="text-subtle-token text-sm leading-relaxed">
                Kendi bünyemizdeki yüksek kapasiteli makine parkurumuz sayesinde standart baskı işleri 24-48 saat içerisinde tamamlanıp teslim edilmektedir.
              </p>
            </div>

            <div className="card-token p-6 bg-white-token border-2 border-cyan-token">
              <h3 className="text-lg font-bold text-main-token mb-2">Online fiyat teklifi nasıl alabilirim?</h3>
              <p className="text-subtle-token text-sm leading-relaxed">
                Web sitemizdeki &apos;İletişim &amp; Teklif Alın&apos; sayfasındaki formu doldurarak projenizin ölçü ve detaylarını iletebilir, uzman ekibimizden anında fiyat teklifi alabilirsiniz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Articles Section */}
      <main className="flex-1 bg-white-token py-20 px-4 sm:px-6 lg:px-8 border-t border-token">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-token">Haberler &amp; Projeler</span>
              <h2 className="text-3xl font-bold text-main-token mt-1">Güncel Duyurular ve İçerikler</h2>
              <p className="text-subtle-token text-sm mt-1">Armonitex tarafından tamamlanan projeler ve sektör haberleri.</p>
            </div>
            <Link
              href="/icerikler"
              className="text-sm font-semibold text-brand-token hover:underline flex items-center gap-1"
            >
              Tüm İçerikleri Gör →
            </Link>
          </div>

          {contents.length === 0 ? (
            <div className="bg-white-token p-12 rounded-lg border-2 border-cyan-token text-center space-y-2">
              <h3 className="text-base font-semibold text-main-token">Henüz yayınlanmış bir haber bulunmuyor.</h3>
              <p className="text-sm text-subtle-token">Refine Admin Paneli üzerinden yeni duyuru ekleyebilirsiniz.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {contents.map((content) => (
                <article key={content.id} className="card-token p-6 flex flex-col justify-between bg-white-token">
                  <div>
                    <div className="inline-block badge-cyan-token font-semibold text-xs rounded-md mb-4">
                      Sektörel Duyuru
                    </div>
                    <h3 className="text-lg font-bold text-main-token mb-2 hover:text-brand-token transition-colors">
                      {content.title}
                    </h3>
                    <p className="text-subtle-token text-sm line-clamp-3 mb-6 leading-relaxed">
                      {content.body}
                    </p>
                  </div>

                  <Link
                    href={`/icerik/${content.slug}`}
                    className="inline-flex items-center text-sm font-semibold text-brand-token hover:underline pt-4 border-t border-token"
                  >
                    Devamını Oku →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Real Armonitex CTA Banner */}
      <section className="bg-[var(--color-primary)] text-white-token py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Baskı ve Reklam Yatırımlarınız İçin Hemen Teklif Alın</h2>
          <p className="text-cyan-100 text-base max-w-xl mx-auto">
            Projenizin ölçü ve detaylarını iletin, uzman ekibimiz en uygun ve ekonomik baskı fiyatlandırmasını hazırlasın.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Link
              href="/iletisim"
              className="px-6 py-3 bg-white-token text-brand-token hover:bg-cyan-soft-token font-bold rounded-md shadow-md transition-colors"
            >
              Hızlı Teklif Formu
            </Link>
            <a
              href="tel:+902160000000"
              className="px-6 py-3 bg-white-token/10 hover:bg-white-token/20 text-white-token font-semibold rounded-md border border-white-token/30 transition-colors"
            >
              0 (216) 000 00 00
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

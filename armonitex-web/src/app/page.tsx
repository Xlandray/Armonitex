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

  const services = [
    {
      no: "01",
      slug: "ic-mekan-dijital-baski",
      title: "İç Mekan Baskı",
      desc: "Poster, afiş, kanvas tablo, duratrans, fotoblok ve yüksek çözünürlüklü iç mekan grafik baskıları.",
    },
    {
      no: "02",
      slug: "dis-mekan-vinil-baski",
      title: "Dış Mekan Baskı",
      desc: "Vinil (branda) baskı, mesh (delikli) baskı, bina cephe giydirme ve araç giydirme uygulamaları.",
    },
    {
      no: "03",
      slug: "isikli-tabela-totem",
      title: "Tabela & Totem",
      desc: "Işıklı/ışıksız tabela imalatı, pleksi kutu harf, totem tabelalar ve iç mekan yönlendirme sistemleri.",
    },
    {
      no: "04",
      slug: "display-sistemleri",
      title: "Display Sistemleri",
      desc: "Roll-up stand, örümcek stand, plaj bayrağı, flama ve fuar tanıtım panoları imalatı.",
    },
  ];

  const metrics = [
    { value: "1998", label: "Kuruluş Yılı" },
    { value: "50.000+", label: "Tamamlanan Proje" },
    { value: "%100", label: "Müşteri Memnuniyeti" },
    { value: "7/24", label: "Kesintisiz İmalat" },
  ];

  return (
    <div className="min-h-screen bg-white-token flex flex-col font-sans text-main-token">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />

      {/* Hero — asymmetric editorial */}
      <section className="relative bg-white-token bg-grid-token border-b border-token overflow-hidden">
        {/* corner registration marks */}
        <span className="reg-cross-token absolute top-6 left-6 hidden sm:block" aria-hidden />
        <span className="reg-cross-token absolute top-6 right-6 hidden sm:block" aria-hidden />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-7">
            <div className="flex items-center gap-3 flex-wrap rise-token">
              <span className="badge-magenta-token">UPDATE · AÇIKHAVA</span>
              <span className="badge-cyan-token">EST. 1998 · ARMONİTEX</span>
            </div>

            <h1 className="font-display text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-[4.2rem] font-extrabold tracking-tight text-main-token rise-token rise-d1">
              Yüksek Kalitede{" "}
              <span className="accent-underline-token text-brand-token">Dijital Baskı</span>{" "}
              &amp; Açıkhava Çözümleri
            </h1>

            <p className="text-lg text-subtle-token max-w-2xl leading-relaxed rise-token rise-d2">
              Armoni Reklam &amp; UPD Reklam güvencesiyle iç mekan, dış mekan dijital baskı,
              ışıklı/ışıksız tabela, cephe giydirme ve fuar display ürünlerinde{" "}
              <span className="text-main-token font-semibold">28 yıllık tecrübemizle</span> hizmetinizdeyiz.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2 rise-token rise-d3">
              <Link href="/iletisim" className="btn-primary-token text-base px-6 py-3.5">
                Hızlı Teklif Alın →
              </Link>
              <Link href="/kurumsal" className="btn-secondary-token text-base px-6 py-3.5">
                Hakkımızda &amp; Kurumsal
              </Link>
            </div>
          </div>

          {/* Print proof-sheet visual */}
          <div className="lg:col-span-5 rise-token rise-d3">
            <div className="card-token p-5 bg-white-token">
              <div className="flex items-center justify-between border-b border-token pb-3 mb-4">
                <span className="label-mono-token">PROOF / 001</span>
                <span className="font-mono text-[11px] text-muted-token tracking-wider">1440 DPI</span>
              </div>
              <div className="space-y-2.5">
                {services.map((s) => (
                  <div key={s.no} className="flex items-center gap-3">
                    <span className="font-mono text-xs text-muted-token w-6">{s.no}</span>
                    <span
                      className={`h-9 flex-1 rounded-sm ${
                        s.no === "01"
                          ? "bg-cyan-soft-token"
                          : s.no === "02"
                            ? "bg-brand-token"
                            : s.no === "03"
                              ? "bg-magenta-soft-token"
                              : "bg-brand-magenta-token"
                      }`}
                    />
                    <span className="font-mono text-[11px] text-subtle-token tracking-wide w-24 text-right hidden sm:block">
                      {s.title}
                    </span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-token font-mono text-[10px] tracking-wider text-muted-token uppercase">
                <div>
                  <div className="text-brand-token">Renk</div>
                  CMYK + Pantone
                </div>
                <div>
                  <div className="text-brand-token">Format</div>
                  Sınırsız Ebat
                </div>
                <div>
                  <div className="text-brand-token">Teslim</div>
                  24–48 Saat
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Production Metrics Bar */}
      <section className="bg-paper-token border-b border-token">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-y divide-x border-token [&>*]:border-token md:[&>*]:border-y-0">
          {metrics.map((m) => (
            <div key={m.label} className="px-6 py-8 flex flex-col gap-1">
              <div className="font-mono text-3xl sm:text-4xl font-semibold text-main-token tracking-tight">
                {m.value}
              </div>
              <div className="label-mono-token">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Products & Services Grid */}
      <section className="bg-white-token py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div className="max-w-2xl space-y-3">
              <div className="flex items-center gap-2 label-mono-token">
                <span className="reg-cross-token" aria-hidden />
                Hizmet Alanlarımız
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-main-token tracking-tight">
                Baskı ve Açıkhava Çözümlerimiz
              </h2>
              <p className="text-subtle-token text-base">
                Modern baskı parkurumuz ve uzman ekibimizle markanız için ürettiğimiz temel çözümler.
              </p>
            </div>
            <Link
              href="/hizmet/ic-mekan-dijital-baski"
              className="font-display text-sm font-semibold text-brand-token hover:text-brand-token inline-flex items-center gap-1 group whitespace-nowrap"
            >
              Tüm Hizmetler
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/hizmet/${s.slug}`}
                className="card-token group p-6 flex flex-col bg-white-token"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-2xl font-semibold text-brand-token">{s.no}</span>
                  <span className="reg-cross-token opacity-40 group-hover:opacity-100 transition-opacity" aria-hidden />
                </div>
                <h3 className="font-display text-xl font-bold text-main-token mb-2">{s.title}</h3>
                <p className="text-subtle-token text-sm leading-relaxed flex-1">{s.desc}</p>
                <span className="mt-5 pt-4 border-t border-token font-display text-sm font-semibold text-brand-token inline-flex items-center gap-1">
                  İncele
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Production Standards Tabs (dark rhythm section) */}
      <ArchitectureTabs />

      {/* SSS (FAQ) Section - High SEO Ranking Impact */}
      <section className="bg-paper-token py-20 px-4 sm:px-6 lg:px-8 border-t border-token">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center gap-2 label-mono-token">
              <span className="reg-cross-token" aria-hidden />
              Bilgi Merkezi
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-main-token tracking-tight">
              Sıkça Sorulan Sorular
            </h2>
            <p className="text-subtle-token text-sm leading-relaxed">
              Baskı ve açıkhava projeleriniz hakkında en çok merak edilenler. Aradığınızı
              bulamazsanız ekibimize yazın.
            </p>
          </div>

          <div className="lg:col-span-8 space-y-4">
            {faqJsonLd.mainEntity.map((qa, i) => (
              <div key={qa.name} className="card-token p-6 bg-white-token">
                <div className="flex gap-4">
                  <span className="font-mono text-sm text-brand-token pt-0.5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-main-token mb-2">{qa.name}</h3>
                    <p className="text-subtle-token text-sm leading-relaxed">
                      {qa.acceptedAnswer.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Articles Section */}
      <main className="flex-1 bg-white-token py-20 px-4 sm:px-6 lg:px-8 border-t border-token">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 label-mono-token">
                <span className="reg-cross-token" aria-hidden />
                Haberler &amp; Projeler
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-main-token tracking-tight">
                Güncel Duyurular ve İçerikler
              </h2>
              <p className="text-subtle-token text-sm">
                Armonitex tarafından tamamlanan projeler ve sektör haberleri.
              </p>
            </div>
            <Link
              href="/icerikler"
              className="font-display text-sm font-semibold text-brand-token inline-flex items-center gap-1 group whitespace-nowrap"
            >
              Tüm İçerikleri Gör
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {contents.length === 0 ? (
            <div className="bg-paper-token p-12 rounded-lg border border-token text-center space-y-2">
              <span className="reg-cross-token mx-auto" aria-hidden />
              <h3 className="font-display text-base font-semibold text-main-token">
                Henüz yayınlanmış bir haber bulunmuyor.
              </h3>
              <p className="text-sm text-subtle-token">
                Refine Admin Paneli üzerinden yeni duyuru ekleyebilirsiniz.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {contents.map((content) => (
                <article
                  key={content.id}
                  className="card-token group p-6 flex flex-col justify-between bg-white-token"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="badge-cyan-token">SEKTÖREL DUYURU</span>
                      <span className="reg-cross-token opacity-40 group-hover:opacity-100 transition-opacity" aria-hidden />
                    </div>
                    <h3 className="font-display text-lg font-bold text-main-token mb-2 group-hover:text-brand-token transition-colors">
                      {content.title}
                    </h3>
                    <p className="text-subtle-token text-sm line-clamp-3 mb-6 leading-relaxed">
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
        </div>
      </main>

      {/* CTA Banner — navy editorial */}
      <section className="relative bg-navy-gradient-token overflow-hidden">
        <div className="absolute inset-0 bg-grid-navy-token pointer-events-none" aria-hidden />
        <span className="reg-cross-navy-token absolute top-8 left-8 hidden sm:block" aria-hidden />
        <span className="reg-cross-navy-token absolute bottom-8 right-8 hidden sm:block" aria-hidden />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
          <div className="flex justify-center items-center gap-2 label-mono-navy-token">
            <span className="reg-cross-token" aria-hidden />
            Teklif · 24 Saat İçinde Dönüş
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white-token tracking-tight leading-tight">
            Baskı ve Reklam Yatırımlarınız İçin{" "}
            <span className="text-brand-token">Hemen Teklif Alın</span>
          </h2>
          <p className="text-on-navy-muted text-base max-w-xl mx-auto">
            Projenizin ölçü ve detaylarını iletin, uzman ekibimiz en uygun ve ekonomik baskı
            fiyatlandırmasını hazırlasın.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Link href="/iletisim" className="btn-primary-token text-base px-6 py-3.5">
              Hızlı Teklif Formu →
            </Link>
            <a href="tel:+902160000000" className="btn-outline-navy-token text-base px-6 py-3.5 font-mono">
              0 (216) 000 00 00
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

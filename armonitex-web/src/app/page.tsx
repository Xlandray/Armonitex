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

      {/* Hero — minimal, generous whitespace */}
      <section className="bg-white-token">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
          <p className="eyebrow-token rise-token">1998&apos;den Beri · Armonitex Güvencesi</p>

          <h1 className="mt-6 text-4xl sm:text-6xl font-semibold tracking-tight text-main-token leading-[1.08] rise-token rise-d1">
            Yüksek kalitede <span className="text-brand-token">Dijital Baskı</span>
            <br className="hidden sm:inline" /> &amp; açıkhava çözümleri
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-subtle-token max-w-2xl mx-auto leading-relaxed rise-token rise-d2">
            Armoni Reklam &amp; UPD Reklam güvencesiyle iç mekan, dış mekan dijital baskı, ışıklı
            tabela, cephe giydirme ve fuar display ürünlerinde 28 yıllık tecrübe.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3 rise-token rise-d3">
            <Link href="/iletisim" className="btn-primary-token text-base px-7 py-3.5">
              Hızlı Teklif Alın
            </Link>
            <Link href="/kurumsal" className="btn-secondary-token text-base px-7 py-3.5">
              Hakkımızda
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics strip */}
      <section className="bg-white-token border-y border-token">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-token">
          {metrics.map((m) => (
            <div key={m.label} className="px-6 py-10 text-center">
              <div className="text-3xl sm:text-4xl font-semibold text-main-token tracking-tight tabular-nums">
                {m.value}
              </div>
              <div className="mt-1.5 text-sm text-muted-token">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="bg-paper-token py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <p className="eyebrow-token">Hizmet Alanlarımız</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-main-token tracking-tight">
              Baskı ve açıkhava çözümlerimiz
            </h2>
            <p className="mt-4 text-lg text-subtle-token leading-relaxed">
              Modern baskı parkurumuz ve uzman ekibimizle markanız için ürettiğimiz temel çözümler.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/hizmet/${s.slug}`}
                className="card-token group p-8 flex flex-col bg-white-token"
              >
                <span className="text-sm font-semibold text-brand-token tabular-nums">{s.no}</span>
                <h3 className="mt-6 text-xl font-semibold text-main-token">{s.title}</h3>
                <p className="mt-2 text-subtle-token text-sm leading-relaxed flex-1">{s.desc}</p>
                <span className="mt-6 text-sm font-semibold text-brand-token inline-flex items-center gap-1.5">
                  İncele
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Production standards */}
      <ArchitectureTabs />

      {/* SSS (FAQ) */}
      <section className="bg-paper-token py-24 border-t border-token">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="eyebrow-token">Bilgi Merkezi</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-main-token tracking-tight">
              Sıkça sorulan sorular
            </h2>
            <p className="mt-4 text-subtle-token leading-relaxed">
              Baskı ve açıkhava projeleriniz hakkında en çok merak edilenler. Aradığınızı
              bulamazsanız ekibimize yazın.
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="border-t border-token">
              {faqJsonLd.mainEntity.map((qa) => (
                <div key={qa.name} className="py-6 border-b border-token">
                  <h3 className="text-lg font-semibold text-main-token">{qa.name}</h3>
                  <p className="mt-2 text-subtle-token leading-relaxed">{qa.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Haberler */}
      <main className="flex-1 bg-white-token py-24 border-t border-token">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-14 gap-4">
            <div className="max-w-2xl">
              <p className="eyebrow-token">Haberler &amp; Projeler</p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-main-token tracking-tight">
                Güncel Duyurular ve İçerikler
              </h2>
              <p className="mt-4 text-lg text-subtle-token">
                Armonitex tarafından tamamlanan projeler ve sektör haberleri.
              </p>
            </div>
            <Link
              href="/icerikler"
              className="text-sm font-semibold text-brand-token inline-flex items-center gap-1.5 group whitespace-nowrap"
            >
              Tüm İçerikleri Gör
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>

          {contents.length === 0 ? (
            <div className="bg-white-token p-16 rounded-2xl border border-token text-center">
              <h3 className="text-base font-semibold text-main-token">
                Henüz yayınlanmış bir haber bulunmuyor.
              </h3>
              <p className="mt-2 text-sm text-subtle-token">
                Refine Admin Paneli üzerinden yeni duyuru ekleyebilirsiniz.
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
                    <span className="badge-cyan-token">Sektörel Duyuru</span>
                    <h3 className="mt-4 text-lg font-semibold text-main-token group-hover:text-brand-token transition-colors">
                      {content.title}
                    </h3>
                    <p className="mt-2 text-subtle-token text-sm line-clamp-3 leading-relaxed">
                      {content.body}
                    </p>
                  </div>
                  <Link
                    href={`/icerik/${content.slug}`}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-token"
                  >
                    Devamını Oku
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* CTA */}
      <section className="bg-paper-token py-24 border-t border-token">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-semibold text-main-token tracking-tight leading-tight">
            Projeniz için hemen teklif alın
          </h2>
          <p className="mt-5 text-lg text-subtle-token max-w-xl mx-auto leading-relaxed">
            Ölçü ve detayları iletin, uzman ekibimiz en uygun baskı fiyatlandırmasını 24 saat
            içinde hazırlasın.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/iletisim" className="btn-primary-token text-base px-7 py-3.5">
              Hızlı Teklif Formu
            </Link>
            <a href="tel:+902160000000" className="btn-secondary-token text-base px-7 py-3.5">
              0 (216) 000 00 00
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InteractiveCalculator from "@/components/InteractiveCalculator";
import Breadcrumbs from "@/components/Breadcrumbs";
import { servicesData } from "@/data/servicesData";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return servicesData.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const service = servicesData.find((s) => s.slug === resolvedParams.slug);

  if (!service) {
    return { title: "Hizmet Bulunamadı" };
  }

  return {
    title: `${service.title} İmalatı & Fiyatları`,
    description: `${service.shortDesc} Armonitex 28 yıllık tecrübesiyle Şerifali Ümraniye tesisinde hızlı imalat ve montaj imkanı.`,
    keywords: service.seoKeywords,
    alternates: {
      canonical: `/hizmet/${service.slug}`,
    },
    openGraph: {
      title: `${service.title} İmalatı & Fiyatları | Armonitex`,
      description: service.shortDesc,
      url: `https://armonitex.com.tr/hizmet/${service.slug}`,
      type: "website",
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const service = servicesData.find((s) => s.slug === resolvedParams.slug);

  if (!service) notFound();

  // Service Schema.org Structured Data
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.title,
    provider: {
      "@type": "LocalBusiness",
      name: "Armonitex Dijital Baskı & Açıkhava Çözümleri",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Yukarı Dudullu, Edep Sk. No:9, 34775",
        addressLocality: "Ümraniye",
        addressRegion: "İstanbul",
        addressCountry: "TR"
      }
    },
    description: service.fullDescription,
    offers: {
      "@type": "Offer",
      price: service.unitPriceEstimate,
      priceCurrency: "TRY",
      availability: "https://schema.org/InStock"
    }
  };

  // SSS Schema
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-white-token flex flex-col font-sans text-main-token">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Header />

      {/* Hero Section */}
      <section className="relative bg-white-token bg-grid-token border-b border-token overflow-hidden">
        <span className="reg-cross-token absolute top-6 right-6 hidden sm:block" aria-hidden />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 space-y-5">
          <Breadcrumbs items={[{ label: "Hizmetler", href: "/hizmet/ic-mekan-dijital-baski" }, { label: service.title }]} />
          <div className="flex items-center gap-3">
            <span className="badge-magenta-token">{service.codeNumber}</span>
            <span className="badge-cyan-token">{service.badge}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-main-token leading-[1.05]">
            {service.title}{" "}
            <span className="accent-underline-token text-brand-token">İmalat &amp; Uygulama</span>
          </h1>
          <p className="text-subtle-token text-lg max-w-3xl leading-relaxed">{service.shortDesc}</p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Full Description Card */}
        <div className="card-token p-8 md:p-10 space-y-6 bg-white-token">
          <div className="flex items-center gap-2 label-mono-token pb-3 border-b border-token">
            <span className="reg-cross-token" aria-hidden />
            Üretim &amp; Teknik Özellikler
          </div>
          <p className="text-subtle-token leading-relaxed text-base">{service.fullDescription}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="space-y-4">
              <h3 className="font-display font-bold text-main-token text-base">Öne Çıkan Özellikler</h3>
              <ul className="space-y-3 text-sm text-subtle-token">
                {service.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="mt-0.5 w-5 h-5 rounded-sm bg-brand-token text-white-token flex items-center justify-center text-xs font-bold shrink-0">
                      ✓
                    </span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-display font-bold text-main-token text-base">Teknik Detaylar</h3>
              <div className="space-y-0 text-sm bg-paper-token rounded-lg border border-token overflow-hidden">
                {service.specifications.map((spec, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between gap-4 px-4 py-2.5 border-b border-token last:border-b-0"
                  >
                    <span className="font-medium text-main-token">{spec.label}</span>
                    <span className="font-mono text-subtle-token text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Live Instant Calculator */}
        <InteractiveCalculator initialSlug={service.slug} />

        {/* FAQs */}
        {service.faqs.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 label-mono-token">
              <span className="reg-cross-token" aria-hidden />
              Sıkça Sorulan Sorular
            </div>
            <div className="space-y-4">
              {service.faqs.map((faq, idx) => (
                <div key={idx} className="card-token p-6 bg-white-token">
                  <div className="flex gap-4">
                    <span className="font-mono text-sm text-brand-token pt-0.5">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="space-y-2">
                      <h3 className="font-display text-base font-bold text-main-token">{faq.question}</h3>
                      <p className="text-sm text-subtle-token leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other Services Navigation */}
        <div className="pt-8 border-t border-token space-y-6">
          <h2 className="font-display text-xl font-bold text-main-token">
            Diğer Baskı &amp; Reklam Hizmetlerimiz
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {servicesData
              .filter((s) => s.slug !== service.slug)
              .map((other) => (
                <Link
                  key={other.slug}
                  href={`/hizmet/${other.slug}`}
                  className="card-token group p-5 bg-white-token flex flex-col"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-sm text-brand-token">{other.codeNumber}</span>
                    <span className="reg-cross-token opacity-40 group-hover:opacity-100 transition-opacity" aria-hidden />
                  </div>
                  <h3 className="font-display font-bold text-sm text-main-token flex-1">{other.title}</h3>
                  <span className="font-display text-xs font-semibold text-brand-token mt-3 inline-flex items-center gap-1">
                    İncele
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </Link>
              ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

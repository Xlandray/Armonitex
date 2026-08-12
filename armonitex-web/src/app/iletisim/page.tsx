import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "./ContactForm";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  CONTACT_ADDRESS,
  CONTACT_ADDRESS_LINE,
  CONTACT_COMPANY_NAME,
  CONTACT_EMAILS,
  CONTACT_HOURS,
  CONTACT_MAP_QUERY,
  CONTACT_PHONES,
} from "@/data/contactData";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim & Fabrika Adresi",
  description: "Armonitex & UPD Açıkhava Çözümleri iletişim bilgileri, Ümraniye Dudullu üretim tesisi adresi ve teklif formu.",
  alternates: {
    canonical: "/iletisim",
  },
  openGraph: {
    title: "İletişim | Armonitex Dijital Baskı & Açıkhava Çözümleri",
    description: `${CONTACT_ADDRESS_LINE} tesisimizden hızlı teklif ve bilgi alın.`,
    url: "https://armonitex.com.tr/iletisim",
  },
};

export default function IletisimPage() {
  return (
    <div className="min-h-screen bg-white-token flex flex-col font-sans text-main-token">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <Breadcrumbs items={[{ label: "İletişim" }]} />

        {/* Page Title Header */}
        <div className="max-w-3xl space-y-4">
          <p className="eyebrow-token">Ümraniye Üretim Tesisi</p>
          <h1 className="text-4xl sm:text-5xl font-semibold text-main-token tracking-tight">
            Bizimle <span className="text-brand-token">iletişime</span> geçin
          </h1>
          <p className="text-lg text-subtle-token leading-relaxed">
            Projenizin detaylarını iletin veya Ümraniye tesisimizi ziyaret ederek baskı numunelerimizi
            yerinde inceleyin.
          </p>
        </div>

        {/* Main Grid: Contact Info & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="card-token p-8 bg-white-token space-y-6">
              <h2 className="text-lg font-semibold text-main-token pb-4 border-b border-token">
                İletişim Bilgileri
              </h2>

              <div className="space-y-5 text-sm">
                <div>
                  <div className="form-label-token">Fabrika &amp; Üretim Adresi</div>
                  <div className="font-semibold text-main-token">{CONTACT_COMPANY_NAME}</div>
                  <div className="text-subtle-token mt-0.5 leading-relaxed">
                    {CONTACT_ADDRESS.street}<br />
                    {CONTACT_ADDRESS.district}
                  </div>
                </div>

                <div className="pt-4 border-t border-token">
                  <div className="form-label-token">E-posta</div>
                  <div className="space-y-1">
                    {CONTACT_EMAILS.map((email) => (
                      <a
                        key={email}
                        href={`mailto:${email}`}
                        className="text-brand-token font-semibold hover:underline block"
                      >
                        {email}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-token">
                  <div className="form-label-token">Telefon</div>
                  <div className="space-y-1">
                    {CONTACT_PHONES.map((phone) => (
                      <a
                        key={phone.href}
                        href={phone.href}
                        className="text-brand-token font-semibold text-base hover:underline block"
                      >
                        {phone.display}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-token">
                  <div className="form-label-token">Çalışma Saatleri</div>
                  <div className="text-subtle-token">
                    {CONTACT_HOURS.map((entry) => (
                      <div key={entry.days}>
                        {entry.days}: {entry.hours}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(CONTACT_MAP_QUERY)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary-token text-sm py-2.5 w-full justify-center"
              >
                Google Haritalar&apos;da Yol Tarifi Al ↗
              </a>
            </div>
          </div>

          {/* Right Column: Contact & Quotation Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>

        {/* Dynamic Interactive Google Map Location */}
        <section className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-semibold text-main-token tracking-tight">
              Üretim Tesisimiz Konumu
            </h2>
            <span className="text-xs text-subtle-token bg-cyan-soft-token px-3 py-1.5 rounded-md border border-cyan-token">
              {CONTACT_ADDRESS_LINE}
            </span>
          </div>

          <div className="rounded-2xl overflow-hidden border border-token shadow-md h-[400px] relative bg-canvas-token">
            <iframe
              title="Armonitex Şerifali Tesis Konumu"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(CONTACT_MAP_QUERY)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "./ContactForm";
import Breadcrumbs from "@/components/Breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İletişim & Fabrika Adresi",
  description: "Armonitex & UPD Açıkhava Çözümleri iletişim bilgileri, Ümraniye Dudullu üretim tesisi adresi ve teklif formu.",
  alternates: {
    canonical: "/iletisim",
  },
  openGraph: {
    title: "İletişim | Armonitex Dijital Baskı & Açıkhava Çözümleri",
    description: "Yukarı Dudullu, Edep Sk. No:9, 34775 Ümraniye/İstanbul tesisimizden hızlı teklif ve bilgi alın.",
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
                  <div className="font-semibold text-main-token">
                    Armoni Reklam &amp; UPD Açıkhava Çözümleri
                  </div>
                  <div className="text-subtle-token mt-0.5 leading-relaxed">
                    Yukarı Dudullu, Edep Sk. No:9<br />
                    34775 Ümraniye / İstanbul, Türkiye
                  </div>
                </div>

                <div className="pt-4 border-t border-token">
                  <div className="form-label-token">E-posta</div>
                  <a
                    href="mailto:derya@armonitex.com.tr"
                    className="text-brand-token font-semibold hover:underline block"
                  >
                    derya@armonitex.com.tr
                  </a>
                </div>

                <div className="pt-4 border-t border-token">
                  <div className="form-label-token">Web</div>
                  <a
                    href="https://ateacikhava.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-token font-semibold hover:underline block"
                  >
                    ateacikhava.com
                  </a>
                </div>

                <div className="pt-4 border-t border-token">
                  <div className="form-label-token">Telefon</div>
                  <a
                    href="tel:+902164207052"
                    className="text-brand-token font-semibold text-base hover:underline block"
                  >
                    0216 420 70 52
                  </a>
                </div>

                <div className="pt-4 border-t border-token">
                  <div className="form-label-token">Çalışma Saatleri</div>
                  <div className="text-subtle-token">
                    Hafta İçi: 08:30 - 18:30<br />
                    Cumartesi: 09:00 - 14:00
                  </div>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=Yukarı+Dudullu+Edep+Sk+No+9+34775+Ümraniye+İstanbul"
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
              Yukarı Dudullu, Edep Sk. No:9, 34775 Ümraniye/İstanbul
            </span>
          </div>

          <div className="rounded-2xl overflow-hidden border border-token shadow-md h-[400px] relative bg-canvas-token">
            <iframe
              title="Armonitex Ümraniye Tesis Konumu"
              src="https://maps.google.com/maps?q=Yukarı%20Dudullu%2C%20Edep%20Sk.%20No%3A9%2C%2034775%20%C3%9Cmraniye%2F%C4%B0stanbul&t=&z=16&ie=UTF8&iwloc=&output=embed"
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

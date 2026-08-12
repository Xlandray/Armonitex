import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArchitectureTabs from "@/components/ArchitectureTabs";
import Breadcrumbs from "@/components/Breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hakkımızda & Kurumsal",
  description: "1998'den bu yana 28 yıllık tecrübesiyle Armoni Reklam & UPD Reklam bünyesinde dijital baskı ve açıkhava reklam üretimi.",
  alternates: {
    canonical: "/kurumsal",
  },
  openGraph: {
    title: "Kurumsal | Armonitex Dijital Baskı & Açıkhava Çözümleri",
    description: "28 yıllık sektör liderliği, yüksek kapasiteli baskı parkuru ve müşteri odaklı çözümlerimiz.",
    url: "https://armonitex.com.tr/kurumsal",
  },
};

export default function KurumsalPage() {
  return (
    <div className="min-h-screen bg-white-token flex flex-col font-sans text-main-token">
      <Header />

      {/* Corporate Header Banner — minimal */}
      <section className="bg-white-token border-b border-token">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-5">
          <Breadcrumbs items={[{ label: "Kurumsal" }]} />
          <p className="eyebrow-token">Armoni Reklam · UPD Açıkhava</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-main-token leading-[1.05] max-w-4xl">
            28 yıllık sektör otoritesi ve <span className="text-brand-token">imalat gücü</span>
          </h1>
          <p className="text-lg text-subtle-token max-w-3xl leading-relaxed">
            1998 yılında kurulan Armoni Reklam ve grup markamız UPD Açıkhava Çözümleri ile
            Türkiye&apos;nin önde gelen kurumsal markalarına iç mekan, dış mekan dijital baskı ve
            reklam çözümleri sunuyoruz.
          </p>
        </div>
      </section>

      <main className="flex-1">
        {/* Story & Vision */}
        <section className="bg-paper-token">
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-token p-8 bg-white-token">
              <p className="eyebrow-token">01 · Tarihçe</p>
              <h2 className="mt-3 text-xl font-semibold text-main-token">Tarihçemiz &amp; Kuruluş</h2>
              <p className="mt-4 text-subtle-token leading-relaxed">
                1998 yılında İstanbul&apos;da temelleri atılan firmamız, dijital baskı
                teknolojilerinin gelişimiyle birlikte parkurunu sürekli yenilemiş ve bugün Ümraniye
                Şerifali tesislerinde yüksek kapasiteli üretim gerçekleştiren bir entegre tesis
                haline gelmiştir.
              </p>
              <p className="mt-3 text-subtle-token leading-relaxed">
                UPD Açıkhava Çözümleri markamızla büyük ölçekli bina cephe giydirme, totem tabela
                imalatı ve mağaza konsept uygulamalarında uzmanlaşmış bulunuyoruz.
              </p>
            </div>

            <div className="card-token p-8 bg-white-token">
              <p className="eyebrow-token">02 · Kalite</p>
              <h2 className="mt-3 text-xl font-semibold text-main-token">
                Kalite &amp; Sürdürülebilirlik
              </h2>
              <p className="mt-4 text-subtle-token leading-relaxed">
                Üretim süreçlerimizde insan sağlığına zararsız, kokusuz eko-solvent ve UV
                mürekkepler tercih edilmektedir. Tüm atık folyo ve alüminyum malzemelerimiz geri
                dönüşüm protokollerine uygun şekilde işlenir.
              </p>
              <ul className="mt-5 space-y-3 text-base text-main-token">
                {[
                  "%100 Orijinal Malzeme Garantisi",
                  "7/24 Kesintisiz Vardiyalı İmalat",
                  "Profesyonel Sahada Montaj Ekibi",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-cyan-soft-token text-brand-token flex items-center justify-center text-xs font-bold shrink-0">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Interactive Production Tabs Component */}
        <ArchitectureTabs />
      </main>

      <Footer />
    </div>
  );
}

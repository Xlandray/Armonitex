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

      {/* Corporate Header Banner — navy editorial */}
      <section className="relative bg-navy-gradient-token overflow-hidden border-b border-on-navy-token">
        <div className="absolute inset-0 bg-grid-navy-token pointer-events-none" aria-hidden />
        <span className="reg-cross-navy-token absolute top-8 right-8 hidden sm:block" aria-hidden />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 sm:pb-20 space-y-6">
          <Breadcrumbs items={[{ label: "Kurumsal" }]} onDark />
          <span className="badge-navy-token">ARMONİ REKLAM · UPD AÇIKHAVA</span>
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white-token leading-[1.05] max-w-4xl">
            28 Yıllık Sektör Otoritesi ve{" "}
            <span className="text-brand-token">İmalat Gücü</span>
          </h1>
          <p className="text-on-navy-muted text-base md:text-lg max-w-3xl leading-relaxed">
            1998 yılında kurulan Armoni Reklam ve grup markamız UPD Açıkhava Çözümleri ile
            Türkiye&apos;nin önde gelen kurumsal markalarına iç mekan, dış mekan dijital baskı ve
            reklam çözümleri sunuyoruz.
          </p>
        </div>
      </section>

      <main className="flex-1">
        {/* Story & Vision */}
        <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card-token p-6 sm:p-8 bg-white-token space-y-4">
            <div className="flex items-center gap-2 label-mono-token pb-3 border-b border-token">
              <span className="font-mono text-brand-token">01</span> Tarihçemiz &amp; Kuruluş
            </div>
            <p className="text-subtle-token text-sm leading-relaxed">
              1998 yılında İstanbul&apos;da temelleri atılan firmamız, dijital baskı teknolojilerinin
              gelişimiyle birlikte parkurunu sürekli yenilemiş ve bugün Ümraniye Şerifali
              tesislerinde yüksek kapasiteli üretim gerçekleştiren bir entegre tesis haline
              gelmiştir.
            </p>
            <p className="text-subtle-token text-sm leading-relaxed">
              UPD Açıkhava Çözümleri markamızla büyük ölçekli bina cephe giydirme, totem tabela
              imalatı ve mağaza konsept uygulamalarında uzmanlaşmış bulunuyoruz.
            </p>
          </div>

          <div className="card-token p-6 sm:p-8 bg-white-token space-y-4">
            <div className="flex items-center gap-2 label-mono-token pb-3 border-b border-token">
              <span className="font-mono text-brand-token">02</span> Kalite &amp; Sürdürülebilirlik
            </div>
            <p className="text-subtle-token text-sm leading-relaxed">
              Üretim süreçlerimizde insan sağlığına zararsız, kokusuz eko-solvent ve UV mürekkepler
              tercih edilmektedir. Tüm atık folyo ve alüminyum malzemelerimiz geri dönüşüm
              protokollerine uygun şekilde işlenir.
            </p>
            <ul className="space-y-3 text-sm font-medium text-main-token pt-2">
              {[
                "%100 Orijinal Malzeme Garantisi",
                "7/24 Kesintisiz Vardiyalı İmalat",
                "Profesyonel Sahada Montaj Ekibi",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-sm bg-brand-token text-white-token flex items-center justify-center text-xs font-bold shrink-0">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Interactive Production Tabs Component (full-bleed dark) */}
        <ArchitectureTabs />
      </main>

      <Footer />
    </div>
  );
}

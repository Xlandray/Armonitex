"use client";
import { useState } from "react";

type TabKey = "indoor_outdoor" | "signage" | "display" | "tech";

const TABS: { key: TabKey; no: string; label: string }[] = [
  { key: "indoor_outdoor", no: "01", label: "Dijital Baskı" },
  { key: "signage", no: "02", label: "Tabelalar & Yönlendirme" },
  { key: "display", no: "03", label: "Display & Fuar" },
  { key: "tech", no: "04", label: "Üretim Teknolojisi" },
];

const TAB_CONTENTS: Record<
  TabKey,
  { title: string; description: string; features: string[]; badge: string }
> = {
  indoor_outdoor: {
    title: "İç Mekan & Dış Mekan Dijital Baskı",
    description:
      "1998'den beri en yüksek çözünürlüklü dijital baskı teknolojileri ile poster, afiş, vinil baskı, mesh baskı, kanvas ve araç giydirme çözümleri sunuyoruz.",
    features: [
      "Yüksek Çözünürlüklü Eco-Solvent Baskı",
      "Dayanıklı Dış Mekan Vinil & Mesh Baskı",
      "Araç ve Bina Cephe Giydirme Üretimi",
      "UV Korumalı Solmaz Renk Kalitesi",
    ],
    badge: "İç & Dış Mekan Baskı",
  },
  signage: {
    title: "Açıkhava Tabelaları & Yönlendirme Levhaları",
    description:
      "Markanızın görünürlüğünü en üst seviyeye çıkaran ışıklı/ışıksız tabela sistemleri, totem tabelalar ve kurumsal yönlendirme levhaları imalatı.",
    features: [
      "Işıklı & Işıksız Tabela İmalatı",
      "Pleksi & Alüminyum Kutu Harf Sistemleri",
      "Kurumsal İç Mekan Yönlendirmeleri",
      "Bina Çatı & Cephe Totem Üretimi",
    ],
    badge: "Açıkhava & Tabela",
  },
  display: {
    title: "Display & Fuar Tanıtım Ekipmanları",
    description:
      "Fuar, lansman ve etkinlikleriniz için taşınabilir, kurulumu kolay ve yüksek kaliteli tanıtım malzemeleri üretimi.",
    features: [
      "Alüminyum Kasalı Roll-up Standlar",
      "Modüler Örümcek Stand & Örümcek Masalar",
      "Plaj Bayrak, Flama & Kırlangıç Flama",
      "Foreks, Dekota & Fotoblok Baskı Çözümleri",
    ],
    badge: "Display & Fuar",
  },
  tech: {
    title: "1998'den Beri İleri Üretim Teknolojimiz",
    description:
      "Tüm baskı ve montaj aşamalarını kendi bünyemizde gerçekleştirebilecek makine parkuru ve uzman teknik ekibimizle 7/24 hizmetinizdeyiz.",
    features: [
      "Japon Teknoloji Dijital Baskı Makineleri",
      "Renk Kalibrasyonel Spektrofotometre Takibi",
      "Bünyemizde Tam Otomatik Kesim & Sonlama",
      "Profesyonel Saha Montaj ve Uygulama Ekibi",
    ],
    badge: "Üretim Altyapısı",
  },
};

export default function ArchitectureTabs() {
  const [activeTab, setActiveTab] = useState<TabKey>("indoor_outdoor");
  const current = TAB_CONTENTS[activeTab];

  return (
    <section className="relative bg-navy-gradient-token overflow-hidden border-y border-on-navy-token">
      <div className="absolute inset-0 bg-grid-navy-token pointer-events-none" aria-hidden />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl space-y-3 mb-10">
          <div className="flex items-center gap-2 label-mono-navy-token">
            <span className="reg-cross-token" aria-hidden />
            Üretim Standartları
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white-token tracking-tight">
            Uçtan Uca Kendi Bünyemizde Üretim
          </h2>
        </div>

        {/* Tab navigation — technical toggles */}
        <div className="flex flex-wrap gap-2 mb-10 border-b border-on-navy-token pb-4">
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`group relative px-4 py-2.5 rounded-md font-display text-sm font-semibold transition-colors flex items-center gap-2 ${
                  active
                    ? "bg-navy-fill-token text-white-token"
                    : "text-on-navy-muted hover:text-white-token"
                }`}
              >
                <span
                  className={`font-mono text-xs ${active ? "text-brand-token" : "text-on-navy-muted"}`}
                >
                  {tab.no}
                </span>
                {tab.label}
                <span
                  className={`absolute left-4 right-4 -bottom-[17px] h-0.5 rounded-full bg-brand-token origin-left transition-transform duration-300 ${
                    active ? "scale-x-100" : "scale-x-0"
                  }`}
                  aria-hidden
                />
              </button>
            );
          })}
        </div>

        {/* Content panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
          <div className="space-y-5">
            <span className="badge-navy-token">{current.badge}</span>
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white-token tracking-tight">
              {current.title}
            </h3>
            <p className="text-on-navy-muted text-base leading-relaxed">{current.description}</p>
          </div>

          <div className="card-dark-token p-6 sm:p-8">
            <div className="flex items-center gap-2 label-mono-navy-token mb-5">
              <span className="reg-cross-navy-token" aria-hidden />
              Öne Çıkan Standartlarımız
            </div>
            <ul className="space-y-4">
              {current.features.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-medium text-on-navy-token">
                  <span className="mt-0.5 w-5 h-5 rounded-sm bg-brand-token text-white-token flex items-center justify-center text-xs font-bold shrink-0">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

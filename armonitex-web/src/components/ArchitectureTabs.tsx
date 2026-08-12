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
    <section className="bg-white-token border-t border-token">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-2xl mb-12">
          <p className="eyebrow-token">Üretim Standartları</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-main-token tracking-tight">
            Uçtan uca kendi bünyemizde üretim
          </h2>
        </div>

        {/* Tab navigation — clean underline toggles */}
        <div className="flex flex-wrap gap-x-8 gap-y-2 mb-12 border-b border-token">
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative -mb-px px-1 pb-4 text-sm font-semibold transition-colors ${
                  active ? "text-main-token" : "text-muted-token hover:text-main-token"
                }`}
              >
                {tab.label}
                <span
                  className={`absolute left-0 right-0 bottom-0 h-0.5 bg-brand-token transition-opacity ${
                    active ? "opacity-100" : "opacity-0"
                  }`}
                  aria-hidden
                />
              </button>
            );
          })}
        </div>

        {/* Content panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            <span className="badge-cyan-token">{current.badge}</span>
            <h3 className="mt-5 text-2xl sm:text-3xl font-semibold text-main-token tracking-tight">
              {current.title}
            </h3>
            <p className="mt-4 text-subtle-token text-lg leading-relaxed">{current.description}</p>
          </div>

          <ul className="space-y-4">
            {current.features.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-base text-main-token border-b border-token pb-4"
              >
                <span className="mt-1 w-5 h-5 rounded-full bg-cyan-soft-token text-brand-token flex items-center justify-center text-xs font-bold shrink-0">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

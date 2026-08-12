import Link from "next/link";
import Logo from "./Logo";

const YEAR = new Date().getFullYear();

const QUICK_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/kurumsal", label: "Hakkımızda & Kurumsal" },
  { href: "/icerikler", label: "Haberler & Projeler" },
  { href: "/iletisim", label: "İletişim & Teklif Formu" },
];

const SERVICES = [
  "İç Mekan Dijital Baskı",
  "Dış Mekan Vinil & Mesh Baskı",
  "Işıklı / Işıksız Tabela & Totem",
  "Roll-up, Örümcek Stand & Display",
];

export default function Footer() {
  return (
    <footer className="bg-paper-token border-t border-token">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-token">
          <div className="space-y-4 md:col-span-1">
            <Logo className="h-10" />
            <p className="text-sm text-subtle-token leading-relaxed">
              Armoni Reklam &amp; UPD Reklam güvencesiyle 1998 yılından bu yana iç/dış mekan dijital
              baskı ve açıkhava tanıtım imalatı.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-main-token mb-4">Hızlı Bağlantılar</h4>
            <ul className="space-y-3 text-sm">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-subtle-token hover:text-brand-token transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-main-token mb-4">Ürün ve Hizmetler</h4>
            <ul className="space-y-3 text-sm text-subtle-token">
              {SERVICES.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            <h4 className="text-sm font-semibold text-main-token mb-4">İletişim &amp; Adres</h4>
            <p className="text-sm text-subtle-token leading-relaxed">
              Yukarı Dudullu, Edep Sk. No:9, 34775 Ümraniye / İstanbul
            </p>
            <a
              href="mailto:derya@armonitex.com.tr"
              className="block text-sm text-subtle-token hover:text-brand-token transition-colors"
            >
              derya@armonitex.com.tr
            </a>
            <a
              href="https://ateacikhava.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-subtle-token hover:text-brand-token transition-colors"
            >
              ateacikhava.com
            </a>
            <a
              href="tel:+902164207052"
              className="block text-sm font-semibold text-main-token hover:text-brand-token transition-colors"
            >
              0216 420 70 52
            </a>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-token">
          <p className="text-center sm:text-left">
            © 1998—{YEAR} Armonitex (Armoni Reklam &amp; UPD Açıkhava Çözümleri). Tüm hakları saklıdır.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#" className="hover:text-brand-token transition-colors">Gizlilik Politikası</a>
            <a href="#" className="hover:text-brand-token transition-colors">Kullanım Şartları</a>
            <a href="#" className="hover:text-brand-token transition-colors">KVKK Aydınlatma Metni</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

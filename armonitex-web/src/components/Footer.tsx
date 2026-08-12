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
  "İç Mekan Dijital Baskı (Poster, Afiş, Kanvas)",
  "Dış Mekan Baskı (Vinil, Mesh, Araç Giydirme)",
  "Işıklı / Işıksız Tabela & Totem",
  "Roll-up, Örümcek Stand & Display",
];

export default function Footer() {
  return (
    <footer className="relative bg-navy-gradient-token text-on-navy-token overflow-hidden">
      <div className="absolute inset-0 bg-grid-navy-token pointer-events-none" aria-hidden />

      {/* Oversized editorial wordmark strip */}
      <div className="relative border-b border-on-navy-token">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 label-mono-navy-token mb-4">
              <span className="reg-cross-token" aria-hidden />
              1998 — {YEAR}
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-white-token leading-none">
              Baskıya <span className="text-brand-token">hazır mısınız?</span>
            </h2>
          </div>
          <Link href="/iletisim" className="btn-primary-token text-base px-6 py-3 self-start md:self-auto">
            Projenizi Başlatın →
          </Link>
        </div>
      </div>

      {/* Columns */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-on-navy-token">
          <div className="space-y-4 md:col-span-1">
            <Logo className="h-10" />
            <p className="text-sm text-on-navy-muted leading-relaxed">
              Armoni Reklam &amp; UPD Reklam güvencesiyle 1998 yılından bu yana iç/dış mekan dijital
              baskı ve açıkhava tanıtım imalatı.
            </p>
          </div>

          <div>
            <h4 className="label-mono-navy-token mb-5">Hızlı Bağlantılar</h4>
            <ul className="space-y-3 text-sm">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center gap-2 text-on-navy-muted hover:text-white-token transition-colors"
                  >
                    <span className="text-brand-token opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      →
                    </span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="label-mono-navy-token mb-5">Ürün ve Hizmetler</h4>
            <ul className="space-y-3 text-sm text-on-navy-muted">
              {SERVICES.map((s) => (
                <li key={s} className="flex items-start gap-2 leading-snug">
                  <span className="reg-cross-navy-token mt-1" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            <h4 className="label-mono-navy-token">İletişim &amp; Adres</h4>
            <div>
              <div className="font-mono text-[11px] tracking-wider uppercase text-brand-token mb-1">Adres</div>
              <p className="text-sm text-on-navy-muted leading-snug">
                Yukarı Dudullu, Edep Sk. No:9, 34775 Ümraniye / İstanbul
              </p>
            </div>
            <div>
              <div className="font-mono text-[11px] tracking-wider uppercase text-brand-token mb-1">E-posta</div>
              <a
                href="mailto:info@armonitex.com.tr"
                className="text-sm text-on-navy-token hover:text-white-token transition-colors"
              >
                info@armonitex.com.tr
              </a>
            </div>
            <div>
              <div className="font-mono text-[11px] tracking-wider uppercase text-brand-token mb-1">Telefon</div>
              <a
                href="tel:+902160000000"
                className="font-mono text-sm text-on-navy-token hover:text-white-token transition-colors"
              >
                0 (216) 000 00 00
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] tracking-wide text-on-navy-muted">
          <p className="text-center sm:text-left">
            © 1998—{YEAR} Armonitex (Armoni Reklam &amp; UPD Açıkhava Çözümleri). Tüm hakları saklıdır.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#" className="hover:text-white-token transition-colors">Gizlilik Politikası</a>
            <a href="#" className="hover:text-white-token transition-colors">Kullanım Şartları</a>
            <a href="#" className="hover:text-white-token transition-colors">KVKK Aydınlatma Metni</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

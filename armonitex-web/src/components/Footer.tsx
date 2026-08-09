import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-navy-token text-white-token pt-16 pb-12 border-t border-token">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-token/20">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="py-1">
              <Logo className="h-11" />
            </div>
            <p className="text-sm text-cyan-100/90 leading-relaxed">
              Armoni Reklam &amp; UPD Reklam güvencesiyle 1998 yılından bu yana iç/dış mekan dijital baskı ve açıkhava tanıtım imalatı.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white-token font-bold text-xs tracking-wider uppercase mb-4">Hızlı Bağlantılar</h4>
            <ul className="space-y-2 text-sm text-cyan-100/90">
              <li>
                <Link href="/" className="hover:text-white-token hover:underline transition-colors">Ana Sayfa</Link>
              </li>
              <li>
                <Link href="/kurumsal" className="hover:text-white-token hover:underline transition-colors">Hakkımızda &amp; Kurumsal</Link>
              </li>
              <li>
                <Link href="/icerikler" className="hover:text-white-token hover:underline transition-colors">Haberler &amp; Projeler</Link>
              </li>
              <li>
                <Link href="/iletisim" className="hover:text-white-token hover:underline transition-colors">İletişim &amp; Teklif Formu</Link>
              </li>
            </ul>
          </div>

          {/* Enterprise Solutions */}
          <div>
            <h4 className="text-white-token font-bold text-xs tracking-wider uppercase mb-4">Ürün ve Hizmetler</h4>
            <ul className="space-y-2 text-sm text-cyan-100/90">
              <li>İç Mekan Dijital Baskı (Poster, Afiş, Kanvas)</li>
              <li>Dış Mekan Baskı (Vinil, Mesh, Araç Giydirme)</li>
              <li>Işıklı / Işıksız Tabela &amp; Totem</li>
              <li>Roll-up, Örümcek Stand &amp; Display</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            <h4 className="text-white-token font-bold text-xs tracking-wider uppercase mb-4">İletişim &amp; Adres</h4>
            <p className="text-sm text-cyan-100/90 leading-snug">
              📍 Yukarı Dudullu, Edep Sk. No:9, 34775 Ümraniye / İstanbul
            </p>
            <p className="text-sm text-cyan-100/90 pt-1">
              ✉️ info@armonitex.com.tr
            </p>
            <p className="text-sm text-cyan-100/90 font-mono">
              📞 0 (216) 000 00 00
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-cyan-200/80">
          <p>© 1998 - {new Date().getFullYear()} Armonitex (Armoni Reklam &amp; UPD Açıkhava Çözümleri). Tüm hakları saklıdır.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-white-token hover:underline transition-colors">Gizlilik Politikası</a>
            <a href="#" className="hover:text-white-token hover:underline transition-colors">Kullanım Şartları</a>
            <a href="#" className="hover:text-white-token hover:underline transition-colors">KVKK Aydınlatma Metni</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

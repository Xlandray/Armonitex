"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const NAV_ITEMS: { href: string; label: string; match: string }[] = [
  { href: "/", label: "Ana Sayfa", match: "/" },
  { href: "/hizmet/ic-mekan-dijital-baski", label: "Hizmetlerimiz", match: "/hizmet" },
  { href: "/kurumsal", label: "Kurumsal", match: "/kurumsal" },
  { href: "/icerikler", label: "Haberler", match: "/icerikler" },
  { href: "/iletisim", label: "İletişim", match: "/iletisim" },
];

export default function Header() {
  const [lang, setLang] = useState<"tr" | "en">("tr");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (item: { href: string; match: string }) =>
    item.match === "/" ? pathname === "/" : pathname.startsWith(item.match);

  return (
    <header className="sticky top-0 z-50 w-full bg-header-token backdrop-blur-md border-b border-token">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center shrink-0" aria-label="Armonitex ana sayfa">
          <Logo className="h-10" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  active ? "text-brand-token" : "text-subtle-token hover:text-main-token"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/auth/login"
            className="hidden xl:inline-flex text-sm font-medium text-subtle-token hover:text-main-token transition-colors"
          >
            Müşteri Girişi
          </Link>

          <div className="hidden sm:inline-flex items-center rounded-lg bg-canvas-token p-0.5 border border-token text-xs font-semibold">
            <button
              onClick={() => setLang("tr")}
              className={`px-2 py-1 rounded-md transition-colors ${
                lang === "tr" ? "bg-white-token text-brand-token" : "text-muted-token hover:text-main-token"
              }`}
            >
              TR
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-1 rounded-md transition-colors ${
                lang === "en" ? "bg-white-token text-brand-token" : "text-muted-token hover:text-main-token"
              }`}
            >
              EN
            </button>
          </div>

          <Link href="/iletisim" className="hidden md:inline-flex btn-primary-token text-sm py-2.5 px-5">
            Teklif Alın
          </Link>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-token text-main-token hover:border-brand-token transition-colors"
            aria-label="Menüyü aç/kapat"
            aria-expanded={open}
          >
            <span className="relative block w-5 h-3.5" aria-hidden>
              <span
                className={`absolute left-0 top-0 h-0.5 w-full bg-current transition-transform duration-300 ${
                  open ? "translate-y-1.5 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 h-0.5 w-full bg-current transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-3 h-0.5 w-full bg-current transition-transform duration-300 ${
                  open ? "-translate-y-1.5 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white-token border-t border-token">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`py-3 text-base font-medium border-b border-token transition-colors ${
                  isActive(item) ? "text-brand-token" : "text-subtle-token hover:text-main-token"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-4">
              <Link
                href="/auth/login"
                onClick={() => setOpen(false)}
                className="btn-secondary-token flex-1 justify-center text-sm"
              >
                Müşteri Girişi
              </Link>
              <Link
                href="/iletisim"
                onClick={() => setOpen(false)}
                className="btn-primary-token flex-1 justify-center text-sm"
              >
                Teklif Alın
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

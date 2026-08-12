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
    <header className="sticky top-0 z-50 w-full">
      {/* Technical utility strip */}
      <div className="bg-navy-token border-on-navy-token border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-wider text-on-navy-muted uppercase">
            <span className="reg-cross-navy-token" aria-hidden />
            <span className="hidden sm:inline">Şerifali · Ümraniye / İstanbul</span>
            <span className="sm:hidden">Ümraniye / İstanbul</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px] tracking-wider text-on-navy-muted uppercase">
            <span className="hidden md:inline">Est. 1998 — 28 Yıl</span>
            <a
              href="tel:+902160000000"
              className="text-on-navy-token hover:text-white-token transition-colors"
            >
              0 (216) 000 00 00
            </a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="bg-header-token backdrop-blur-md border-b border-token">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[70px] flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center group shrink-0" aria-label="Armonitex ana sayfa">
            <Logo className="h-10" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative px-3 py-2 font-display text-sm font-semibold transition-colors ${
                    active
                      ? "text-brand-token"
                      : "text-subtle-token hover:text-brand-token"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute left-3 right-3 -bottom-px h-0.5 origin-left rounded-full bg-brand-token transition-transform duration-300 ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                    aria-hidden
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/auth/login"
              className="hidden xl:inline-flex items-center px-3 py-2 font-display text-sm font-semibold text-subtle-token hover:text-brand-token transition-colors"
            >
              Müşteri Girişi
            </Link>

            {/* Language switcher */}
            <div className="hidden sm:inline-flex rounded-md bg-canvas-token p-0.5 border border-token font-mono text-[11px] font-medium">
              <button
                onClick={() => setLang("tr")}
                className={`px-2 py-1 rounded transition-all ${
                  lang === "tr"
                    ? "bg-white-token text-brand-token"
                    : "text-muted-token hover:text-main-token"
                }`}
              >
                TR
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-2 py-1 rounded transition-all ${
                  lang === "en"
                    ? "bg-white-token text-brand-token"
                    : "text-muted-token hover:text-main-token"
                }`}
              >
                EN
              </button>
            </div>

            <Link
              href="/iletisim"
              className="hidden md:inline-flex btn-primary-token text-sm py-2 px-4"
            >
              Teklif Alın →
            </Link>

            {/* Mobile toggle */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-token text-main-token hover:border-brand-token hover:text-brand-token transition-colors"
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
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white-token border-b border-token shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-3 rounded-md font-display text-base font-semibold transition-colors ${
                  isActive(item)
                    ? "text-brand-token bg-cyan-soft-token"
                    : "text-subtle-token hover:bg-canvas-token hover:text-brand-token"
                }`}
              >
                <span className="reg-cross-token" aria-hidden />
                {item.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-3 mt-2 border-t border-token">
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
                Teklif Alın →
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

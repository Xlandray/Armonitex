"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

export default function Header() {
  const [lang, setLang] = useState<"tr" | "en">("tr");
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  return (
    <header className="sticky top-0 z-50 w-full bg-white-token border-b border-token backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center group py-2">
          <Logo className="h-11" />
        </Link>

        <nav className="flex items-center space-x-1 sm:space-x-4">
          <Link
            href="/"
            className={`px-2.5 py-1.5 text-sm font-semibold transition-all rounded-md ${
              pathname === "/"
                ? "text-brand-token bg-cyan-soft-token border-b-2 border-[var(--color-primary)] font-bold"
                : "text-subtle-token hover:text-brand-token hover:bg-canvas-token"
            }`}
          >
            Ana Sayfa
          </Link>
          <Link
            href="/hizmet/ic-mekan-dijital-baski"
            className={`px-2.5 py-1.5 text-sm font-semibold transition-all rounded-md ${
              isActive("/hizmet")
                ? "text-brand-token bg-cyan-soft-token border-b-2 border-[var(--color-primary)] font-bold"
                : "text-subtle-token hover:text-brand-token hover:bg-canvas-token"
            }`}
          >
            Hizmetlerimiz
          </Link>
          <Link
            href="/kurumsal"
            className={`px-2.5 py-1.5 text-sm font-semibold transition-all rounded-md ${
              isActive("/kurumsal")
                ? "text-brand-token bg-cyan-soft-token border-b-2 border-[var(--color-primary)] font-bold"
                : "text-subtle-token hover:text-brand-token hover:bg-canvas-token"
            }`}
          >
            Kurumsal
          </Link>
          <Link
            href="/icerikler"
            className={`px-2.5 py-1.5 text-sm font-semibold transition-all rounded-md ${
              isActive("/icerikler")
                ? "text-brand-token bg-cyan-soft-token border-b-2 border-[var(--color-primary)] font-bold"
                : "text-subtle-token hover:text-brand-token hover:bg-canvas-token"
            }`}
          >
            Haberler
          </Link>
          <Link
            href="/iletisim"
            className={`px-2.5 py-1.5 text-sm font-semibold transition-all rounded-md ${
              isActive("/iletisim")
                ? "text-brand-token bg-cyan-soft-token border-b-2 border-[var(--color-primary)] font-bold"
                : "text-subtle-token hover:text-brand-token hover:bg-canvas-token"
            }`}
          >
            İletişim
          </Link>

          <Link
            href="/auth/login"
            className="hidden lg:inline-flex items-center justify-center px-2.5 py-1.5 text-sm font-semibold text-subtle-token hover:text-brand-token hover:bg-canvas-token rounded-md transition-colors"
          >
            Müşteri Girişi
          </Link>

          <Link
            href="/iletisim"
            className="hidden md:inline-flex btn-primary-token text-sm py-1.5 px-4"
          >
            Teklif Alın →
          </Link>

          {/* Language Switcher */}
          <div className="inline-flex rounded-md bg-canvas-token p-0.5 border border-token text-xs font-semibold">
            <button
              onClick={() => setLang("tr")}
              className={`px-2 py-0.5 rounded transition-all ${
                lang === "tr" ? "bg-white-token text-brand-token font-bold shadow-xs" : "text-muted-token hover:text-main-token"
              }`}
            >
              TR
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-2 py-0.5 rounded transition-all ${
                lang === "en" ? "bg-white-token text-brand-token font-bold shadow-xs" : "text-muted-token hover:text-main-token"
              }`}
            >
              EN
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

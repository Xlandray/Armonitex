import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

// Single refined sans — clean, corporate, minimal (Apple/Bosch feel)
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://armonitex.com.tr"),
  title: {
    default: "Armonitex | Dijital Baskı & Açıkhava Tanıtım Çözümleri (1998'den Beri)",
    template: "%s | Armonitex Dijital Baskı",
  },
  description: "Armoni Reklam & UPD Reklam güvencesiyle Şerifali Ümraniye'deki tesisimizde iç mekan, dış mekan dijital baskı, vinil/mesh baskı, ışıklı tabela ve fuar display sistemleri imalatı.",
  keywords: [
    "Dijital Baskı",
    "İç Mekan Dijital Baskı",
    "Dış Mekan Baskı",
    "Vinil Baskı",
    "Mesh Baskı",
    "Açıkhava Reklam",
    "Işıklı Tabela",
    "Totem Tabela",
    "Araç Giydirme",
    "Roll-up Stand",
    "Armonitex",
    "Armoni Reklam",
    "UPD Açıkhava",
    "Şerifali Dijital Baskı",
    "Ümraniye Reklam İmalatı"
  ],
  authors: [{ name: "Armonitex Dijital Baskı", url: "https://armonitex.com.tr" }],
  creator: "Armonitex (Armoni Reklam & UPD Reklam)",
  publisher: "Armonitex",
  alternates: {
    canonical: "/",
    languages: {
      "tr-TR": "https://armonitex.com.tr",
      "en-US": "https://armonitex.com.tr?lang=en",
    },
  },
  openGraph: {
    title: "Armonitex | Dijital Baskı & Açıkhava Çözümleri",
    description: "1998'den beri yüksek kalitede iç mekan & dış mekan dijital baskı, ışıklı tabela ve tanıtım malzemeleri üretimi.",
    url: "https://armonitex.com.tr",
    siteName: "Armonitex Dijital Baskı",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Armonitex Dijital Baskı & Açıkhava Çözümleri",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Armonitex Dijital Baskı & Açıkhava Çözümleri",
    alternateName: "Armoni Reklam & UPD Açıkhava",
    url: "https://armonitex.com.tr",
    logo: "https://armonitex.com.tr/logo.png",
    description: "İç mekan ve dış mekan dijital baskı, ışıklı/ışıksız tabela, araç giydirme ve fuar display sistemleri üretimi.",
    telephone: "+90-216-420-70-52",
    email: "derya@armonitex.com.tr",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Yukarı Dudullu, Edep Sk. No:9, 34775",
      addressLocality: "Ümraniye",
      addressRegion: "İstanbul",
      addressCountry: "TR"
    },
    foundingDate: "1998",
    priceRange: "$$"
  };

  return (
    <html lang="tr" className={`${manrope.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-white-token text-main-token">
        {children}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}

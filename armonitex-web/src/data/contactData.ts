// İletişim bilgilerinin tek kaynağı.
//
// Adres, telefon ve e-posta daha önce dört ayrı yerde elle yazılıydı: iletişim
// sayfası, Footer, layout.tsx'teki LocalBusiness JSON-LD'si ve hizmet
// sayfalarının Service JSON-LD'si. Bilgi değiştiğinde biri her zaman geride
// kalıyordu; arama motorlarına giden JSON-LD de sessizce eskiyordu. Artık
// hepsi buradan okur.

export type ContactPhone = { display: string; href: string };

export const CONTACT_COMPANY_NAME = "Armoni Reklam & UPD Açıkhava Çözümleri";

// Adresin bu yazımı bilinçli tercih: Google Haritalar tesisi bu metinle doğru
// noktaya pinliyor (kontrol edildi). "Bayraktar Bulvarı, Edep Sok. No:5-9,
// Şerifali" aynı binanın yeni yazımı — Edep Sokak her ikisinde de geçiyor — ama
// haritada karşılığı oturmadığı için sitede kullanılmıyor.
export const CONTACT_ADDRESS = {
  /** Sokak satırı — kartlarda ilk satır olarak gösterilir. */
  street: "Yukarı Dudullu, Edep Sk. No:9",
  /** Posta kodu + ilçe / il + ülke — kartlarda ikinci satır. */
  district: "34775 Ümraniye/İstanbul, Türkiye",
  /** schema.org PostalAddress alanları. */
  postalCode: "34775",
  locality: "Ümraniye",
  region: "İstanbul",
  country: "TR",
} as const;

/** Tek satırlık hâli — Footer, harita rozeti, OG metni ve harita sorgusu. */
export const CONTACT_ADDRESS_LINE =
  `${CONTACT_ADDRESS.street}, ${CONTACT_ADDRESS.postalCode} ${CONTACT_ADDRESS.locality}/${CONTACT_ADDRESS.region}` as const;

export const CONTACT_PHONES: readonly ContactPhone[] = [
  { display: "0216 420 70 52", href: "tel:+902164207052" },
  { display: "0532 330 37 70", href: "tel:+905323303770" },
] as const;

export const CONTACT_EMAILS = [
  "info@armonitex.com.tr",
  "derya@armonitex.com.tr",
  "derya@updateacikhava.com",
] as const;

/** JSON-LD ve tek e-posta gösterilen yerler için birincil adres. */
export const CONTACT_PRIMARY_EMAIL = CONTACT_EMAILS[0];

/** JSON-LD `telephone` alanı tek değer aldığı için sabit hat kullanılır. */
export const CONTACT_PRIMARY_PHONE = CONTACT_PHONES[0];

// Kardeş şirket sitesi (updateacikhava.com) bilerek listelenmiyor: site henüz
// yayına hazır değil. Hazır olduğunda buraya bir CONTACT_WEBSITE sabiti eklenip
// iletişim sayfasındaki bilgi kartına ve Footer'a bağlanabilir. Not: alan adının
// HTTPS'i şu an çalışmıyor (sertifika süresi dolmuş), yayına alınırken bakılmalı.

export const CONTACT_HOURS = [
  { days: "Hafta İçi", hours: "08:30 - 18:30" },
  { days: "Cumartesi", hours: "09:00 - 14:00" },
] as const;

/** schema.org PostalAddress gövdesi — iki ayrı JSON-LD bloğu paylaşır. */
export const CONTACT_POSTAL_ADDRESS_JSON_LD = {
  "@type": "PostalAddress",
  streetAddress: CONTACT_ADDRESS.street,
  postalCode: CONTACT_ADDRESS.postalCode,
  addressLocality: CONTACT_ADDRESS.locality,
  addressRegion: CONTACT_ADDRESS.region,
  addressCountry: CONTACT_ADDRESS.country,
} as const;

/** Google Haritalar yol tarifi ve gömülü harita için arama metni. */
export const CONTACT_MAP_QUERY = CONTACT_ADDRESS_LINE;

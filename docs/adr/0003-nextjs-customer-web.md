# ADR-0003: Müşteri web arayüzü için Next.js kullanımı

- Durum: Kabul edildi
- Tarih: 2026-08-08
- Karar sahipleri: Armonitex mühendislik ekibi

## Bağlam

Müşteriye dönük uygulama, kurumsal kimlikle uyumlu, hızlı ve arama motorları
tarafından anlamlandırılabilir bir deneyim sunmalıdır. Arayüz büyüdükçe ortak
bileşenler, veri erişimi ve yönlendirme standart bir yapıda kalmalıdır.

## Karar

Müşteri web uygulaması **Next.js (React)** ile geliştirilecektir. Uygun sayfalar
sunucu tarafında veya derleme sırasında render edilecek; yalnızca etkileşim
gerektiren bileşenler istemci bileşeni olacaktır. FastAPI ile iletişim, OpenAPI
sözleşmesinden türetilen veya onunla doğrulanan tipli bir istemci katmanından
geçecektir.

Tasarım sistemi, tekrar kullanılabilir erişilebilir UI bileşenleri ve tasarım
token'ları üzerinden kurulacaktır. Sayfalar API çağrılarını rastgele bileşenlere
dağıtmak yerine, belirlenmiş veri erişim sınırlarından kullanacaktır.

## Sonuçlar

Olumlu sonuçlar:

- SSR/önceden üretim ile SEO ve ilk yükleme performansı desteklenir.
- React bileşen modeli görsel ve davranışsal tekrarları azaltır.
- Tipli API istemcisi, backend sözleşme değişikliklerinde erken uyarı sağlar.

Maliyetler ve önlemler:

- Sunucu ve istemci bileşeni ayrımı bilinçli yapılmalıdır; tarayıcıya özgü kod
  sunucu katmanına alınmayacaktır.
- Önbellekleme kuralları sayfa/veri düzeyinde açıkça belgelenecektir.

## Alternatifler

- Sadece istemci tarafı React SPA: SEO ve ilk render gereksinimleri için ek
  altyapı ihtiyacı doğurur.
- Geleneksel çok sayfalı arayüz: bileşen paylaşımı ve zengin etkileşimler için
  daha sınırlı bir geliştirme deneyimi sunar.

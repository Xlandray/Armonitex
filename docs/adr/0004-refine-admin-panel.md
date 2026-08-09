# ADR-0004: Yönetim paneli için Refine kullanımı

- Durum: Kabul edildi
- Tarih: 2026-08-08
- Karar sahipleri: Armonitex mühendislik ekibi

## Bağlam

İç operasyonlar için listeleme, filtreleme, form, yetkilendirme ve CRUD
ekranlarına ihtiyaç vardır. Bu ekranların tamamını ürün arayüzünden bağımsız
olarak sıfırdan geliştirmek; bakım maliyeti, tutarsız yetki denetimleri ve
tekrarlayan UI kodu riski yaratır.

## Karar

Yönetim paneli React tabanlı **Refine** ile geliştirilecektir. Refine veri
sağlayıcısı yalnızca FastAPI'nin yayınlanmış API sözleşmesini kullanacaktır;
veritabanına doğrudan erişmeyecek veya müşteri uygulamasının iç durumuna
bağlanmayacaktır.

Rol ve izin kontrolleri backend'de zorunlu olarak uygulanır. Paneldeki görünürlük
kontrolleri yalnızca kullanıcı deneyimi içindir ve güvenlik sınırı sayılmaz.
Özel iş akışları Refine'ın uzantı noktalarıyla eklenir; genel CRUD altyapısı
kopyalanarak yeniden yazılmaz.

## Sonuçlar

Olumlu sonuçlar:

- Standart operasyon ekranları daha az özel kodla teslim edilir.
- Tablo, filtre, form ve kaynak yönetimi için tutarlı kalıplar oluşur.
- API sınırı korunur; panelin backend'e bağımlılığı açık ve test edilebilir kalır.

Maliyetler ve önlemler:

- Refine sürüm yükseltmeleri düzenli değerlendirilmelidir.
- Panel, ürün arayüzünün tasarım sistemiyle gereksiz yere birleştirilmeyecek;
  paylaşılan paketler yalnızca gerçekten ortak olan bileşenlerde kullanılacaktır.

## Alternatifler

- Özel React paneli: tam esneklik sağlar fakat standart CRUD ihtiyaçları için
  anlamlı miktarda tekrar eden geliştirme ve bakım yükü getirir.
- Veritabanı yönetim aracı: hızlıdır ancak ürün yetkileri ve iş kurallarını
  uygulama API'si üzerinden güvenle işletmek için yeterli değildir.

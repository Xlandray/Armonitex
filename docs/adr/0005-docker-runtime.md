# ADR-0005: Çalışma ortamlarının Docker ile standardizasyonu

- Durum: Kabul edildi
- Tarih: 2026-08-08
- Karar sahipleri: Armonitex mühendislik ekibi

## Bağlam

Geliştirme ortamlarının Ubuntu ve macOS üzerinde tutarlı çalışması, uygulama ile
bağımlılıklarının birlikte sürümlenmesi ve dağıtım davranışının yerelde
tekrarlanabilmesi gerekir. Ortama özel kurulum adımları sürüklenme ve destek
maliyeti oluşturur.

## Karar

API, müşteri web uygulaması, yönetim paneli ve PostgreSQL ayrı Docker
konteynerlerinde çalışacaktır. Yerel orkestrasyon Docker Compose ile
tanımlanacaktır. Konteyner tanımları sürüm kontrolünde tutulacak; yapılandırma
değerleri imaja gömülmeyecek, ortam değişkenleri ve gizli değer yönetimiyle
sağlanacaktır.

Geliştirme ve canlı ortam aynı imaj oluşturma ilkelerini kullanacak; farklar
yalnızca açıkça tanımlanan yapılandırma ve ölçekleme düzeyinde kalacaktır.
Veri kalıcılığı named volume veya yönetilen veritabanı üzerinden sağlanacak,
konteyner dosya sistemi kalıcı veri deposu sayılmayacaktır.

## Sonuçlar

Olumlu sonuçlar:

- İşletim sistemi farkları büyük ölçüde ortadan kalkar.
- Her servis kendi bağımlılık sınırına sahip olur.
- Yerel, test ve canlı ortamlar arasında daha yüksek davranış tutarlılığı sağlanır.

Maliyetler ve önlemler:

- İmajlar çok aşamalı build ve `.dockerignore` ile küçük tutulacaktır.
- Sağlık kontrolleri, bağımlılık sıralamasının yerini alacak şekilde
  tanımlanacaktır.
- Gizli değerler `.env` dosyasına commit edilmez; örnek değerler `.env.example`
  ile belgelenecektir.

## Alternatifler

- Makineye doğrudan kurulum: başlangıçta hızlı görünür; ancak platform farkları
  ve onboarding maliyeti zamanla artar.
- Tek bir monolitik konteyner: servis sınırlarını ve bağımsız yaşam döngülerini
  belirsizleştirir.

# ADR-0006: Aşamalı teslimat ve zorunlu kalite kapıları

- Durum: Kabul edildi
- Tarih: 2026-08-08
- Karar sahipleri: Armonitex mühendislik ekibi

## Bağlam

Çok katmanlı bir uygulamada altyapı, veri modeli, API ve arayüzün rastgele
sırayla geliştirilmesi; sözleşme kırılmalarına, tekrarlanan işlere ve üretime
taşınan kalite sorunlarına neden olur. Özellikle gerçek alan modeli
netleşmeden yazılan tablo ve örnek veri, sonradan maliyetli yeniden tasarımlar
doğurur.

## Karar

Geliştirme, aşağıdaki bağımlılık sırasını ve geçiş kriterlerini izler:

1. Geliştirme ortamı ve CI kalite kapıları
2. Onaylı domain modeli üzerinden veritabanı şeması ve ilk migration
3. Kimlik doğrulama, yetkilendirme ve çekirdek FastAPI sözleşmesi
4. Refine yönetim paneli ve rol bazlı erişim doğrulaması
5. Next.js müşteri deneyimi
6. Birim, entegrasyon ve uçtan uca test otomasyonu

Her aşama, tanımlı doğrulama kriterleri sağlanmadan sonraki aşamanın bağımlı
özelliklerine geçmez. CI; biçimlendirme, statik analiz, test ve build
başarısızsa değişikliği kabul etmez. Migration, OpenAPI ve API istemci
sözleşmesi birlikte gözden geçirilir.

## Sonuçlar

- Kritik teknik kararlar görünür, denetlenebilir teslimat kapılarına dönüşür.
- Veri modeli ve API sözleşmesi, arayüz geliştirmesinden önce kararlı hale gelir.
- Kalite denetimleri geliştiricinin yerel ortamına bağımlı kalmaz.

## Alternatifler

- Katmanları paralel ve sözleşmesiz geliştirmek: kısa vadede hızlı görünse de
  yeniden çalışma ve entegrasyon hatası olasılığını artırır.

# ADR-0001: Backend API için FastAPI kullanımı

- Durum: Kabul edildi
- Tarih: 2026-08-08
- Karar sahipleri: Armonitex mühendislik ekibi

## Bağlam

Sistem, müşteri arayüzü ve yönetim paneli tarafından tüketilecek sözleşme odaklı
bir HTTP API'ye ihtiyaç duyar. API; doğrulanabilir giriş/çıkış modelleri,
asenkron I/O, tutarlı hata yanıtları ve güncel makine-okunabilir dokümantasyon
sunmalıdır. İş kuralları HTTP yönlendirme ayrıntılarından bağımsız kalmalıdır.

## Karar

Backend API, Python üzerinde **FastAPI** ile geliştirilecektir. Pydantic
modelleri API sınırındaki veri sözleşmesinin tek kaynağı olacaktır. FastAPI'nin
ürettiği OpenAPI şeması, istemcilerin ve entegrasyonların resmi API sözleşmesi
olarak kabul edilecektir.

Kod yapısı en az şu sorumlulukları ayıracaktır:

- `api`/router katmanı: HTTP, yetkilendirme bağımlılıkları ve istek/yanıt eşleme
- `schemas`: Pydantic istek ve yanıt sözleşmeleri
- `services`: iş kuralları ve uygulama akışları
- `repositories`: kalıcılık erişimi
- `domain`: çerçeveden bağımsız alan modelleri ve kuralları

Router katmanı iş kuralı veya doğrudan SQL barındırmayacaktır. Haricî I/O yapan
uç noktalar asenkron uçtan uca akış kullanacaktır; bloklayıcı kod gerekli ise
açıkça izole edilerek çalıştırılacaktır.

## Sonuçlar

Olumlu sonuçlar:

- Katı doğrulama ve tip ipuçları sınır hatalarını erken yakalar.
- OpenAPI, istemci geliştirme ve entegrasyon testleri için canlı sözleşme sağlar.
- Asenkron yapı, ağ ve veritabanı I/O'sunda verimli ölçeklenmeye uygundur.
- Katman ayrımı test edilebilirliği ve teknoloji değişimlerini kolaylaştırır.

Maliyetler ve önlemler:

- Pydantic, ORM ve alan modellerinin birbirine sızması riskine karşı dönüşümler
  açık sınır katmanlarında yapılacaktır.
- Asenkron/senkron karışımının performans sorunlarına yol açmaması için
  veritabanı sürücüsü ve dış istemciler seçilirken async uyumluluğu doğrulanacaktır.

## Alternatifler

- Django REST Framework: güçlü bir seçenek olmasına rağmen bu proje için daha
  ağır bir uygulama çerçevesi ve daha fazla varsayılan yüzey alanı getirir.
- Flask: esnektir; ancak doğrulama, şema ve sözleşme altyapısında daha fazla
  proje içi standartlaştırma gerektirir.

# Armonitex Uygulama Planı

Bu plan, kabul edilmiş ADR'lerin uygulanma sırasını ve her aşamanın tamamlanma
ölçütünü tanımlar. Bir aşamanın teslim ölçütleri sağlanmadan onun çıktısına
bağımlı sonraki aşamaya geçilmez.

## 1. Geliştirme ortamı ve CI/CD kurulumu

**Hedef:** Geliştiricinin işletim sisteminden bağımsız, tekrarlanabilir bir
çalışma ortamı ve depoya kalite dışı kod girişini engelleyen kontroller.

**Teslimatlar:**

- API, müşteri web uygulaması ve PostgreSQL için ayrı Docker imajları
- Yerel orkestrasyon için `docker-compose.yml`; API başlamadan önce migration
  çalıştıran bağımsız bir `migrate` servisi
- API için Ruff ve Black yapılandırması
- JavaScript/TypeScript projeleri için eşdeğer linter/formatter yapılandırması
- Pre-commit ile biçimlendirme, statik analiz ve gizli bilgi taraması
- CI iş akışında lint, format doğrulaması, test ve imaj build adımları
- `.env.example`, sağlıklı varsayılanlar ve çalıştırma dokümantasyonu

**Çıkış kriteri:** Temiz bir Ubuntu veya macOS makinede dokümante edilen tek
komutla servisler başlar; CI kalite kontrolleri başarısız bir örnek değişikliği
reddeder.

## 2. Veritabanı şeması ve migration yapısı

**Hedef:** Gerçek Armonitex alan modelini kalıcı, sorgulanabilir ve değiştirilebilir
bir veri yapısına dönüştürmek.

**Teslimatlar:**

- Onaylanmış varlıklar, ilişkiler, yaşam döngüleri ve iş kuralları
- SQLAlchemy modelleri, yabancı anahtarlar, kısıtlar ve gerekli indeksler
- Alembic yapılandırması ve ilk (`initial`) migration
- Migration ileri/geri geçişi için entegrasyon testi
- Veri sözlüğü ve ER diyagramı

**Çıkış kriteri:** Boş PostgreSQL üzerinde migration uygulanır; şema veri
sözlüğüyle uyumludur ve temel ilişki/kısıt testleri geçer.

Alembic, SQLAlchemy async engine ve `asyncpg` sürücüsüyle çalışır. Migration
komutu, `backend` dizininde `DATABASE_URL` ayarlandıktan sonra `alembic upgrade
head` olacaktır. Bağlantı dizesi kaynak koda yazılmaz.

**Açık bağımlılık:** Bu aşama, gerçek domain varlıkları ve iş kuralları
onaylanmadan başlatılmaz. Uydurma üretim verisi veya geçici tablo tasarımı
kullanılmaz.

## 3. Core API geliştirme

**Hedef:** Güvenli, sürümlenebilir ve test edilebilir FastAPI sözleşmesi.

**Teslimatlar:**

- OAuth2/JWT tabanlı oturum açma, token yenileme/iptal stratejisi ve parola
  güvenliği politikası
- Roller, izinler ve backend tarafından zorunlu RBAC denetimi
- Service/repository ayrımında temel CRUD API uç noktaları
- Standart hata modeli, sayfalama, filtreleme ve denetim günlüğü stratejisi
- OpenAPI şeması, Swagger UI ve API entegrasyon testleri

**Çıkış kriteri:** Yetkisiz/izin dışı istekler reddedilir; OpenAPI sözleşmesi
ve endpoint testleri CI içinde çalışır.

## 4. Admin panel entegrasyonu

**Hedef:** Yetkili kullanıcıların işletim verisini API sınırından güvenli biçimde
yönetebilmesi.

**Teslimatlar:**

- Refine uygulaması ve FastAPI ile uyumlu veri sağlayıcısı
- Kimlik doğrulama akışı ve rol bazlı sayfa/işlem görünürlüğü
- İlk yönetilen kaynaklar için liste, detay, oluşturma ve düzenleme ekranları
- RBAC senaryoları için entegrasyon testleri

**Çıkış kriteri:** Panel veritabanına doğrudan erişmez; her kritik işlemde
backend izin denetimi başarılı biçimde test edilir.

## 5. Müşteri yüzü geliştirme

**Hedef:** Yönetilen ve yayınlanabilir veriyi yüksek performanslı bir Next.js
deneyimiyle son kullanıcıya sunmak.

**Teslimatlar:**

- Marka kılavuzu, logo varlıkları ve erişilebilir tasarım token'ları
- Next.js sayfa yapısı ve FastAPI için tipli veri istemcisi
- SEO meta verileri, hata/boş/yüklenme durumları ve responsive arayüzler
- Yönetim panelinde yayımlanan veriyi tüketen ekranlar

**Çıkış kriteri:** Kritik kullanıcı yolculukları mobil ve masaüstünde doğrulanır;
SEO ve erişilebilirlik temel kontrolleri geçer.

## 6. Otonom test ve kalite güvence

**Hedef:** Değişikliklerin iş kurallarını, servisler arası sözleşmeleri ve kritik
kullanıcı akışlarını bozmadığını otomatik kanıtlamak.

**Teslimatlar:**

- Service ve repository katmanları için birim testleri
- Gerçek PostgreSQL kullanan API entegrasyon testleri
- Kimlik, yetki, veri girişi ve müşteri yolculukları için E2E testleri
- CI'da test raporlama, başarısızlık çıktıları ve tekrar üretilebilir test verisi
- Ajan destekli regresyon senaryoları; bulguların insan gözden geçirmesiyle
  doğrulanması

**Çıkış kriteri:** Kritik akışlar otomatik testlerle korunur; CI lint, format,
test ve build aşamalarının tamamını başarıyla tamamlar.

## Uygulama sırası

```text
Ortam & CI ──> Domain + Şema ──> Güvenli API ──> Admin ──> Müşteri Web ──> E2E/Regresyon
                   │                    │              │              │
                   └──────── testler her aşamada artarak devam eder ──┘
```

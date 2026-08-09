# ADR-0002: Kalıcılık katmanı için PostgreSQL, SQLAlchemy ve Alembic kullanımı

- Durum: Kabul edildi
- Tarih: 2026-08-08
- Karar sahipleri: Armonitex mühendislik ekibi

## Bağlam

Sistem, ilişkisel veri bütünlüğünü ve güvenilir şema evrimini korumalıdır.
Gelecekte değişken nitelikli veriler için esneklik gerekirken, temel iş
varlıklarında veritabanı seviyesinde tutarlılık korunmalıdır.

## Karar

Birincil veritabanı **PostgreSQL** olacaktır. Uygulama kalıcılık erişiminde
**SQLAlchemy** kullanacak; şema değişiklikleri yalnızca sürüm kontrolündeki
**Alembic migration** dosyalarıyla uygulanacaktır.

Temel ilişkiler; yabancı anahtar, uygun `NOT NULL`, `UNIQUE`, `CHECK` ve indeks
kısıtlarıyla veritabanında korunacaktır. JSONB yalnızca yapısı gerçekten
değişken olan ve ilişkisel sorgu modeline uymayan veriler için kullanılacaktır.
JSONB, ilişkisel modelleme kararlarını erteleme aracı değildir.

Birincil anahtarlar PostgreSQL `UUID` tipi olacaktır. UUID değerleri uygulama
tarafında tahmin edilebilir artan sayılarla üretilmeyecek; PostgreSQL'in
`pgcrypto` uzantısındaki `gen_random_uuid()` işleviyle veritabanında
oluşturulacaktır.

Denetim zaman damgaları da veritabanı tarafından yönetilir. `updated_at`,
uygulama dışından yapılan geçerli SQL güncellemelerinde dahi tutarlı kalması
için PostgreSQL tetikleyicisiyle güncellenir.

Migration kuralları:

- Her şema değişikliği bir migration içerir; elle canlı şema değişikliği yapılmaz.
- Migration hem ileri geçişi hem de güvenli ise geri dönüş yolunu tanımlar.
- Uygulama, migration'lar uygulanmadan uyumsuz şemaya karşı dağıtılmaz.
- Yıkıcı veri dönüşümleri aşamalı ve geri alınabilir dağıtım planıyla yapılır.

## Sonuçlar

Olumlu sonuçlar:

- İlişkisel bütünlük uygulama hatalarına karşı ikinci bir koruma katmanı kazanır.
- Alembic ile veritabanı şeması, uygulama kodu ve dağıtım geçmişi izlenebilir olur.
- PostgreSQL'in JSONB ve indeksleri, esneklik gereken sınırlı alanları destekler.

Maliyetler ve önlemler:

- ORM tüm sorguları gizlemez; kritik sorgular gözden geçirilecek, indeks ve
  sorgu planları ölçülecektir.
- Migration çatışmaları kod incelemesinde çözülür; üretimde otomatik şema
  üretimi kullanılmaz.

## Alternatifler

- MySQL: geçerli bir ilişkisel alternatif olsa da PostgreSQL'in gelişmiş tip ve
  JSONB yetenekleri proje ihtiyaçlarıyla daha iyi örtüşür.
- Şemasız veritabanı: temel ilişkisel kuralları uygulama koduna taşır ve veri
  bütünlüğü riskini artırır.

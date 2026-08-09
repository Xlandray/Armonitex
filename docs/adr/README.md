# Architecture Decision Records

Bu klasör, Armonitex projesinin uzun ömürlü mimari kararlarını saklar. Her kayıt
bir kararın bağlamını, sonucunu ve etkilerini tanımlar.

## Kurallar

- Yeni kayıtlar artan sıra numarasıyla eklenir ve kabul edildiğinde değiştirilmez.
- Bir karar değişirse eski kayıt güncellenmez; onun yerine eski kaydın yerini alan
  yeni bir ADR yazılır.
- Durumlar: `Önerildi`, `Kabul edildi`, `Reddedildi`, `Yerine geçildi`.
- Uygulama ayrıntıları (sürüm numaraları, çevresel değişken adları ve komutlar)
  ilgili README veya operasyon dokümanında tutulur. ADR'ler kalıcı mimari niyeti
  ifade eder.

## Kayıtlar

| No | Karar | Durum |
| --- | --- | --- |
| [0001](0001-fastapi-backend-api.md) | Backend API için FastAPI kullanımı | Kabul edildi |
| [0002](0002-postgresql-persistence.md) | Kalıcılık katmanı için PostgreSQL, SQLAlchemy ve Alembic kullanımı | Kabul edildi |
| [0003](0003-nextjs-customer-web.md) | Müşteri web arayüzü için Next.js kullanımı | Kabul edildi |
| [0004](0004-refine-admin-panel.md) | Yönetim paneli için Refine kullanımı | Kabul edildi |
| [0005](0005-docker-runtime.md) | Çalışma ortamlarının Docker ile standardizasyonu | Kabul edildi |
| [0006](0006-delivery-and-quality-gates.md) | Aşamalı teslimat ve zorunlu kalite kapıları | Kabul edildi |

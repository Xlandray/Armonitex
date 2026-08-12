# Müşteri Portalı — Tasarım Dokümanı (Spec)

- **Tarih:** 2026-08-12
- **Durum:** Onay bekliyor
- **Konum:** `armonitex-web` içinde `/portal` altında (mevcut sitenin parçası)

## 1. Amaç ve kapsam

Armonitex müşterilerine, giriş yaparak kendi işlerini takip edebilecekleri bir portal. **İlk sürüm (v1) kapsamı:**

- **Proje/sipariş takibi** — müşteri kendi projelerinin durumunu görür.
- **Teklif & fatura** — yapılandırılmış kayıt (tutar, durum, tarih) + opsiyonel PDF eki; portalda liste + durum rozeti.
- **Doküman/dosya paylaşımı** — projeye bağlı dosyaların indirilmesi.

**Kapsam dışı (v1):** destek talebi/mesajlaşma, açık self-kayıt, dış sistem entegrasyonu (ERP/muhasebe), çok-kullanıcılı firma hesapları.

## 2. Kararlar (özet)

| Konu | Karar |
|------|-------|
| Portal konumu | `armonitex-web` içinde `/portal/*` |
| Veri yönetimi | Admin panelden (yeni Refine kaynakları); müşteri salt-okur |
| Hesap açma | Sadece admin oluşturur; açık kayıt kapatılır |
| Hesap modeli | Tek kullanıcı = tek müşteri (`is_customer` bayrağı) |
| İlişki yapısı | User(müşteri) → Projeler → {FinancialRecord, Document} |
| Teklif/Fatura | Tek tablo `financial_records`, `type` alanı (quote/invoice) + opsiyonel PDF |
| Dosya depolama | Yerel Docker volume, korumalı indirme endpoint'i |
| Web oturumu | httpOnly cookie + Next Route Handler proxy + `middleware.ts` koruması |

## 3. Veri modeli (backend)

Mevcut kalıp: `TimestampMixin` + UUID PK (`gen_random_uuid()`) + `postgresql+asyncpg`. **Tüm yeni modeller `app/models/__init__.py`'den export edilmeli** (Alembic autogenerate için şart).

### 3.1 User (değişiklik)
`User` modeline eklenir:
- `is_customer: bool` — `server_default=false`. Portal erişimini belirler.
- İlişki: `projects: list[Project]` (`back_populates="customer"`, `cascade="all, delete-orphan"`, `passive_deletes=True`).

`is_superuser` (admin panel) ile `is_customer` (portal) birbirinden bağımsız iki bayrak. Bir hesabın normalde tek biri true olur; ikisi de false olan kullanıcı ne panele ne portala girer.

### 3.2 Project — tablo `projects`
- `id` UUID PK
- `customer_id` → `users.id` (FK, `ondelete="CASCADE"`, index, nullable=False)
- `title: str(255)`, `description: Text | None`
- `reference_no: str(64) | None` — insan-okur takip numarası
- `status: str` — enum değerleri: `teklif`, `onaylandi`, `uretimde`, `tamamlandi`, `iptal` (DB'de `String` + uygulama-katmanı doğrulaması; SQLAlchemy `Enum` yerine string tutulur, migrasyon esnekliği için)
- `created_at`, `updated_at`
- İlişkiler: `customer: User`, `financial_records: list[FinancialRecord]`, `documents: list[Document]` (child'lar CASCADE)

### 3.3 FinancialRecord — tablo `financial_records`
- `id` UUID PK
- `project_id` → `projects.id` (FK, CASCADE, index, nullable=False)
- `type: str` — `quote` | `invoice`
- `number: str(64)` — teklif/fatura numarası
- `amount: Numeric(12, 2)`, `currency: str(3)` default `TRY`
- `status: str` — birleşik enum: `bekliyor`, `onaylandi`, `reddedildi`, `odendi`, `gecikti`
  - **Service katmanı** `type`'a uygun alt kümeyi zorlar:
    - `quote` → `bekliyor` / `onaylandi` / `reddedildi`
    - `invoice` → `bekliyor` / `odendi` / `gecikti`
- `issue_date: date | None`, `due_date: date | None`
- `document_id` → `documents.id` (FK, `ondelete="SET NULL"`, nullable=True) — ekli PDF
- `created_at`, `updated_at`

### 3.4 Document — tablo `documents`
- `id` UUID PK
- `project_id` → `projects.id` (FK, CASCADE, index, nullable=False)
- `original_filename: str(255)`, `stored_path: str(512)` (volume köküne göreli), `content_type: str(128)`, `size_bytes: int`
- `uploaded_by` → `users.id` (FK, `ondelete="SET NULL"`, nullable=True) — yükleyen admin
- `created_at`

### 3.5 Sahiplik zinciri (güvenlik çekirdeği)
Her portal okuması `project.customer_id == current_customer.id` ile filtrelenir. Bu kural **repository katmanında** uygulanır (route veya service'te ad-hoc değil) — bir müşteri asla başka müşterinin verisine erişemez. FinancialRecord ve Document sorguları `Project` üzerinden join'lenerek aynı sahiplik kontrolünü miras alır.

## 4. Backend API yüzeyi

Kalıp: **route → Service → Repository → DomainError**. Servisler `fastapi` import etmez; route'lar `DomainError`'ı `HTTPException`'a çevirir (`routes/admin.py`'daki `not_found`/`conflict` helper kalıbı). Tüm liste endpoint'leri `Page[...]` döner (`{data, total}` + `page`/`page_size`), aksi halde admin grid'i bozulur.

### 4.1 Admin (`/api/v1/admin/*`, `CurrentSuperuser`)
- `projects` — CRUD (`customer_id` seçimi)
- `financial-records` — CRUD (`project_id`, `type`, `amount`, `status`, tarihler)
- `documents` — `GET` (list, paginated), `DELETE`, ve ayrı **upload**: `POST /admin/documents` `multipart/form-data` (`project_id` + `file`) → `storage`'a yazar, kaydı oluşturur
- `users` — müşteri oluşturma buradan. Bugün admin panelde user-create kapalı (`canCreate={false}`, create whitelist boş) ve `POST /admin/users` yok. Eklenir:
  - Backend: `POST /admin/users` — `{email, full_name, password, is_customer}` alır, `AdminUserService` parolayı hash'ler, kaydı oluşturur (email çakışması → `409`).
  - Edit whitelist'ine `is_customer` eklenir. `is_superuser` müşteri hesaplarında `false` kalır.

### 4.2 Portal (`/api/v1/portal/*`, yeni `CurrentCustomer`)
Yeni `get_current_customer` dependency: aktif kullanıcı **ve** `is_customer=True`, aksi halde `403`. Tümü **salt-okunur**, `customer_id`'ye göre filtreli, resource-oriented + query filtre:
- `GET /portal/me` → profil (`full_name`, `email`)
- `GET /portal/projects` (paginated) → müşterinin projeleri
- `GET /portal/projects/{id}` → tekil proje (sahiplik doğrulanır, değilse `404`)
- `GET /portal/financial-records?project_id=` (paginated) → o projenin teklif/faturaları (proje sahipliği doğrulanır)
- `GET /portal/documents?project_id=` (paginated) → o projenin dokümanları
- `GET /portal/documents/{id}/download` → sahiplik doğrulanır, dosya `FileResponse` ile döner (uygun `Content-Disposition` + `content_type`)

### 4.3 Auth değişiklikleri (`/api/v1/auth/*`)
- **Açık kayıt kapatılır:** `POST /users` kaldırılır (veya `is_customer` üretmeyecek şekilde iç kullanıma indirgenir). Müşteri hesapları yalnızca admin üzerinden.
- **Parola sıfırlama tamamlanır** (mevcut ölü link kapatılır): `forgot-password` zaten `.../auth/reset-password?token=` linki gönderiyor ama ne endpoint ne sayfa var.
  - Yeni `POST /auth/reset-password` — `{token, new_password}`. Token, `purpose="pwreset"` claim'i ve **kısa TTL** (ör. 30 dk) ile üretilir; genel access token'dan ayrılır (`core/security.py`'ye `create_password_reset_token` / `decode_password_reset_token`). Doğrulanınca parola güncellenir.
  - `forgot-password` bu yeni kısa-ömürlü token'ı kullanacak şekilde güncellenir.

### 4.4 Depolama
Yeni `app/core/storage.py`:
- Kök dizin `settings.STORAGE_DIR` (config'e eklenir, `docker-compose.yml`'de `storage` named volume → `/app/storage`).
- Kaydetme: UUID tabanlı güvenli dosya adı; orijinal ad DB'de tutulur. Path-traversal koruması (kök dışına çıkış reddedilir).
- Okuma: yalnızca DB kaydındaki `stored_path` üzerinden; kullanıcı girdisiyle path oluşturulmaz.

## 5. Admin panel değişiklikleri

Mevcut generic yapı korunur (düşük borç = tutarlılık):
- `App.tsx` `resources` dizisine + route'lara `admin/projects`, `admin/financial-records`, `admin/documents` eklenir.
- `JsonResourceFormPage`'in `writableFields` haritasına `admin/projects` ve `admin/financial-records` alanları eklenir (mevcut JSON-textarea formu bunlar için yeterli; admin iç kullanım).
- `admin/documents` için multipart gerektiğinden **ayrı `DocumentUploadPage`** eklenir; `dataProvider`'a yalnızca bu kaynak için ince bir multipart `create` dalı eklenir (diğer kaynaklar değişmez). Liste + silme generic `ResourceListPage` ile.
- `admin/users` route'unda create yeniden açılır (`canCreate`), create whitelist'i `email, full_name, password, is_customer` olur; edit whitelist'ine `is_customer` eklenir.

## 6. Web portalı (`armonitex-web`)

> **Not (uygulama aşaması):** Bu Next.js sürümü eğitim verisinden farklı olabilir — kod yazmadan önce `node_modules/next/dist/docs/` içindeki ilgili rehber okunacak (AGENTS.md kuralı). Tüm renk/stil **yalnızca** `globals.css` semantik token sınıflarıyla (`.card-token`, `.btn-primary-token`, `.input-token`, `.text-brand-token` vb.) — ad-hoc renk yasağı (ADR-0007).

### 6.1 Oturum yönetimi (Yaklaşım A)
- `src/app/api/auth/login/route.ts` (POST) — gövdeyi backend `/auth/token`'a (form-urlencoded) proxy'ler; başarılıysa JWT'yi **httpOnly, Secure, SameSite=Lax** cookie (`access_token`) olarak yazar; hata durumunda `401` + mesaj döner.
- `src/app/api/auth/logout/route.ts` (POST) — cookie'yi temizler.
- `src/middleware.ts` — `/portal/:path*` matcher; cookie yoksa `/auth/login`'e yönlendirir.
- `src/lib/serverApi.ts` — sunucu bileşenleri için: cookie'den token okuyup `Authorization: Bearer` ekleyen fetch sarmalayıcı; `401`'de login'e yönlendirir.

### 6.2 Sayfalar (App Router, mümkün olduğunca Server Component)
- `src/app/portal/layout.tsx` — portal kabuğu (başlık, müşteri adı, "Çıkış" → logout route). `Header`/`Footer` ile tutarlı token'lar.
- `src/app/portal/page.tsx` — **Dashboard**: projelerin listesi (durum rozeti, referans no, tarih). Boş durum mesajı.
- `src/app/portal/projeler/[id]/page.tsx` — **Proje detayı**: üstte proje bilgisi/durumu; iki bölüm — "Teklif & Faturalar" (tip + tutar + durum rozeti, varsa PDF indir linki) ve "Dokümanlar" (indir linki). Sahiplik `404`'te `not-found` sayfası.
- `src/app/portal/dokuman/[id]/route.ts` — indirme proxy'si: cookie ile backend `/portal/documents/{id}/download`'a vurup akışı geçirir (token httpOnly kalır).

### 6.3 Mevcut auth sayfaları
- `login/page.tsx` — yeni `/api/auth/login` route'una POST edecek + **hata gösterecek** şekilde güncellenir; başarıda `/portal`'a yönlenir (bugün `/`'a gidip token'ı atıyor — düzeltilir).
- `register/page.tsx` — açık kayıt kapatıldığı için kaldırılır; login'deki "Hesap oluştur" linki çıkarılır.
- `forgot-password/page.tsx` — korunur.
- `auth/reset-password/page.tsx` — **yeni**: token'ı query'den alır, yeni parola formu, `POST /auth/reset-password`'e gönderir (mevcut ölü link kapanır).

## 7. Hata yönetimi ve güvenlik

- **Yetkilendirme:** portal endpoint'leri `CurrentCustomer`; sahiplik repository katmanında zorlanır. Başkasının kaydı → `404` (varlık sızıntısını önlemek için `403` yerine `404`).
- **Cookie:** httpOnly + Secure + SameSite=Lax; token JS'e görünmez (XSS'e dayanıklı).
- **Dosya indirme:** her indirmede sahiplik doğrulanır; dosyalar web kökü dışında volume'de; path-traversal guard.
- **Parola sıfırlama:** kısa-ömürlü, amaç-claim'li token; `forgot-password` kullanıcı var/yok ayrımını sızdırmaz (mevcut davranış korunur).
- **Açık kayıt kapalı:** müşteri hesabı sadece admin.
- **CORS:** mevcut `CORS_ALLOWED_ORIGINS` yeterli (aynı origin proxy kullanıldığı için portal fetch'leri sunucu-taraflı).

## 8. Test

- **Backend:** repo'da backend test suite'i **yok** (CLAUDE.md) — bu spec test altyapısı kurmayı kapsamaz; "testler geçiyor" iddiası edilmeyecek. Manuel/`curl` doğrulama + admin panelden uçtan uca akış.
- **Web (Playwright, `tests/e2e/`):** yeni spec — admin bir müşteri + proje + teklif/fatura + doküman oluşturur (veya seed), müşteri giriş yapar, dashboard'da projeyi görür, detayda teklif/fatura ve dokümanı görür, dokümanı indirir. Yetkisiz `/portal` erişimi login'e yönlenir.
- **Seed:** e2e için idempotent bir seed script'i (bootstrap_superuser kalıbına benzer) — bir örnek müşteri + proje + kayıtlar.

## 9. Migrasyonlar

Yeni modeller export edildikten sonra tek Alembic revizyonu: `users.is_customer` kolonu + `projects`, `financial_records`, `documents` tabloları + FK/index'ler. `alembic revision --autogenerate` → gözden geçir → `upgrade head`. Compose `migrate` adımı otomatik uygular.

## 10. Dosya envanteri (uygulama planı için)

**Backend — yeni:** `models/project.py`, `models/financial_record.py`, `models/document.py`; `schemas/{project,financial_record,document}.py`; `repositories/{project,financial_record,document}_repository.py`; `services/{project,financial_record,document}_service.py`; `services/portal_service.py`; `routes/portal.py`; `core/storage.py`; e2e seed script.
**Backend — değişiklik:** `models/user.py`, `models/__init__.py`, `api/deps.py` (`CurrentCustomer`), `api/v1/router.py` (portal router), `routes/auth.py` (reset-password), `routes/users.py` (açık kayıt kaldır), `core/security.py` (reset token), `core/config.py` (`STORAGE_DIR`), `routes/admin.py` (yeni kaynaklar), Alembic revizyonu, `docker-compose.yml` (storage volume).
**Admin — değişiklik:** `App.tsx`, `JsonResourceFormPage.tsx`, `dataProvider.ts` (+ yeni `DocumentUploadPage.tsx`).
**Web — yeni:** `app/api/auth/login/route.ts`, `app/api/auth/logout/route.ts`, `middleware.ts`, `lib/serverApi.ts`, `app/portal/layout.tsx`, `app/portal/page.tsx`, `app/portal/projeler/[id]/page.tsx`, `app/portal/dokuman/[id]/route.ts`, `app/auth/reset-password/page.tsx`, e2e portal spec.
**Web — değişiklik:** `app/auth/login/page.tsx`; `app/auth/register/page.tsx` kaldır.

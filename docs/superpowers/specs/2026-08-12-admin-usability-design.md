# Admin Panel Kullanılabilirlik Tasarımı

**Tarih:** 2026-08-12
**Kapsam:** `admin-panel/` + `backend/` (admin uçları). `armonitex-web/` ve portal cevap şemaları değişmez.

## Amaç

Config-driven admin refactor'ünden sonra panel çalışıyor ama günlük kullanıma uygun değil:
hatalar görünmüyor, listelerde arama/filtre yok, ilişkiler ham UUID olarak görünüyor ve
bir projeyi yönetmek üç ayrı sekme geziyor. Bu tasarım o dört boşluğu kapatır.

## Doğrulanmış bulgular

| Bulgu | Kanıt |
| --- | --- |
| Hiçbir CRUD hatası kullanıcıya ulaşmıyor | `admin-panel/src` içinde `notificationProvider` yok; `axios.ts` yalnızca request interceptor tanımlıyor |
| Backend hataları doğru üretiyor | `admin.py:42-48` `not_found`/`conflict` yardımcıları 404/409 döndürüyor |
| Listelerde yalnızca sayfalama var | `admin.py:38-39` sadece `PageNumber`/`PageSize`; `dataProvider.getList` sadece `page`/`page_size` gönderiyor |
| İlişkiler okunaksız | `ProjectRead.customer_id`, `FinancialRecordRead.project_id` ham UUID |
| Teklif/fatura projeye göre filtrelenemiyor | `GET /admin/financial-records` `project_id` kabul etmiyor; yalnızca `/admin/documents` ediyor |
| Altı repository'nin `list()`'i aynı kalıbın kopyası | `content/setting/user/project/financial_record` repo'ları + `document.list_for_project` |
| Portal listeleri ayrı metotlar kullanıyor | `portal_service.py:23,37` → `list_for_customer` / `list_for_project` |

Son satır kritik: repo'ların `list()` metodu **yalnızca admin tarafından** kullanılıyor,
dolayısıyla oraya eklenen eager load ve filtreler portalı etkilemez.

## Paketleme

Üç paket, sırayla: **A → B → C**. C, B2'ye bağımlıdır. A bağımsızdır.

---

## Paket A — Hata görünürlüğü

### A1. `providers/axios.ts` — response interceptor

FastAPI'nin iki hata şeklini Refine'ın `HttpError`'ına
(`{ message: string, statusCode: number, errors?: ValidationErrors }`,
`@refinedev/core/dist/contexts/data/types.d.cts:197`) normalize eder:

- `detail: string` (404/409/403) → `message` olarak kullanılır.
- `detail: [{loc, msg, type}, ...]` (422) → `loc` dizisinin son elemanı alan adı kabul edilir
  (`["body","email"]` → `email`), `errors` haritası kurulur, `message` özet metin olur.
- Ağ hatası / timeout → sabit Türkçe mesaj ("Sunucuya ulaşılamadı.").

Interceptor `axiosInstance` üzerinde durduğu için `dataProvider`, `DocumentsPage` ve
`ResourceSelect` aynı anda kazanır.

### A2. `App.tsx` — notificationProvider

`@refinedev/antd` v6 `useNotificationProvider` **hook**'unu export eder
(`dist/providers/notificationProvider/index.d.cts`). antd `message` context'i gerektirdiği için
`<AntdApp>` içinde çağrılmalıdır; `App` gövdesinde çağrılırsa context dışında kalır.
Çözüm: `<AntdApp>` ile `<Refine>` arasına ince bir iç bileşen.

### A3. `ResourceFormPage` — alan bazlı hata

`useCreate`/`useUpdate` `onError`'ında `error.errors` varsa
`form.setFields([{ name, errors: [msg] }])` ile alanlara bağlanır.

Refine'ın `useForm`'una geçiş **kapsam dışı**: yeni yazılmış bir dosyayı `toPayload`
dönüşümü uğruna baştan kurmaya değmez; kazanç (otomatik bağlama) on satırda alınıyor.

### A4. `toPayload` — boş alan temizlenebilsin

Mevcut davranış boş string'i payload'dan düşürüyor, bu yüzden `full_name`, `description`,
`reference_no` bir kez doldurulunca temizlenemiyor.

Yeni kural:
- `text` / `textarea`: boş string → `null` gönderilir (ilgili backend şemalarında hepsi `str | None`).
- `password` / `select` / `resourceSelect`: boş değer düşürülmeye devam eder — şifre alanının
  boş bırakılınca değişmemesi bu ayrımla korunur.

---

## Paket B — Liste veri katmanı

### B1. Ortak sayfalama yardımcısı

Yeni dosya `backend/app/repositories/_paging.py`:

```python
async def paginate(session, model, *, conditions=(), order_by=(), options=(), offset, limit):
    stmt = select(model).where(*conditions).options(*options).order_by(*order_by).offset(offset).limit(limit)
    total = await session.scalar(select(func.count()).select_from(model).where(*conditions))
    return list((await session.execute(stmt)).scalars()), total or 0
```

Sayım `subquery()` yerine aynı `conditions` ile doğrudan model üzerinden yapılır; böylece
eager-load `options` sayım sorgusuna sızmaz. Altı repo'nun `list()` gövdesi buna indirgenir;
her repo yalnızca kendi `conditions` / `order_by` / `options` kümesini kurar.

Bu, daha önce "dokunmaya değmez" denen repository tekrarını açar — gerekçe değişti: filtre
altı repo'ya ayrı ayrı eklenirse tekrar altıya katlanırdı.

### B2. Filtre / arama / sıralama sözleşmesi

Her kaynak kendi **beyaz listesine** sahiptir. Sıralama anahtarı asla ham kolon adı olarak
geçmez; allowlist dışı değer 422 döner.

| Kaynak | `q` araması | Filtreler | Sıralama anahtarları |
| --- | --- | --- | --- |
| contents | title, slug | `is_published` | created_at, updated_at, title |
| settings | key, description | — | key |
| users | email, full_name | `is_customer`, `is_superuser`, `is_active` | created_at, email |
| projects | title, reference_no | `status`, `customer_id` | created_at, title, status |
| financial-records | number | `type`, `status`, `project_id` | created_at, issue_date, due_date, amount |
| documents | — | `project_id` (zorunlu kalır) | created_at |

- `q` → ilgili kolonlar üzerinde `ILIKE %...%` `OR` birleşimi.
- `sort` biçimi: `created_at` (artan) / `-created_at` (azalan).
- Doğrulama (allowlist kontrolü) servis katmanındadır; route yalnızca `Query` tiplerini tanımlar.
  Geçersiz anahtar `ResourceConflictError` değil, doğrudan FastAPI `Query` kısıtı veya servis
  tarafında `ValueError` → route'ta 422 olarak yüzer.

### B3. Okunabilir kimlik

Yeni salt-okunur şemalar:

```python
class UserBrief(Schema):      # schemas/user.py
    id: uuid.UUID; email: EmailStr; full_name: str | None

class ProjectBrief(Schema):   # schemas/project.py
    id: uuid.UUID; title: str; reference_no: str | None

class AdminProjectRead(ProjectRead):          customer: UserBrief
class AdminFinancialRecordRead(FinancialRecordRead): project: ProjectBrief
```

`Schema` tabanı `from_attributes=True` olduğu için ilişki nesnesi doğrudan validate edilir
(`schemas/base.py:7`). Düz `customer_label` string'i yerine iç içe brief tercih edildi çünkü
link için `id` gerekiyor.

Eager load **zorunludur**, optimizasyon değil: async SQLAlchemy'de eager load olmadan
`project.customer`'a erişmek `MissingGreenlet` fırlatır. `paginate`'e
`options=(selectinload(Project.customer),)` geçilir.

`ProjectRead` / `FinancialRecordRead` değişmez → portal cevabı ve admin detay uçları aynı kalır.
Yalnızca iki liste ucunun `response_model`'i `Admin*Read`'e döner.

### B4. `dataProvider.getList`

Refine'ın `filters` / `sorters` parametrelerini query string'e çevirir:

- `eq` operatörü → `?alan=değer`
- `field === "q"` → `?q=...`
- tek `sorter` → `?sort=-created_at`

Desteklenmeyen operatör **sessizce yutulmaz**; `console.warn` ile bildirilir. Sessiz bozulma
bu kod tabanında zaten bilinen bir sorun (bkz. web tarafındaki kırık token modifikatörleri),
tekrarlanmayacak.

### B5. Config ve liste sayfası

`resources.tsx`:

```ts
type ColumnDef = {
  ...
  sortable?: boolean;
  filter?: { options: { value: string; label: string }[] };
  linkTo?: (record: Record<string, unknown>) => string;
};

type ResourceConfig = {
  ...
  searchable?: boolean;
};
```

`ResourceListPage`:
- `searchable` ise başlığa debounce'lu arama kutusu (Refine `filters` state'ine `q` yazar).
- `sortable` kolonlara Ant `sorter`, `filter` tanımlı kolonlara Ant `filters` bağlanır.
- `linkTo` tanımlı hücre `<Link>` ile sarılır.

Kolon güncellemeleri: projelerde `customer_id` → `customer` (etiket: ad · e-posta, müşteri
kaydına link), teklif/faturaya `project` kolonu (proje adı, proje detayına link).

---

## Paket C — Proje detay ekranı

### C1. Rota

`/projects/show/:id`. Refine kaynak tanımına `show` eklenir; Projeler listesindeki proje adı
buraya linklenir.

### C2. Ekran

Tek sayfa, üç blok:

1. **Başlık kartı** — proje adı, referans no, durum rozeti, müşteri (kullanıcı kaydına link),
   oluşturma/güncelleme tarihleri, "Düzenle" butonu (mevcut edit sayfasına).
2. **Teklif/Faturalar** — `GET /admin/financial-records?project_id=…` (B2'de gelen filtre).
   Tabloda düzenle/sil; "Ekle" butonu proje önceden seçili create formuna gider.
3. **Dokümanlar** — yükleme + tablo; proje zaten belli olduğu için seçici yok.

### C3. `DocumentsPage` ile ortaklık

Doküman yükleme + tablo bloğu `ProjectDocuments` bileşenine çıkarılır (props: `projectId`).
Hem proje detay ekranı hem mevcut `DocumentsPage` onu kullanır; `DocumentsPage` proje seçici
+ bu bileşen haline iner. Yükleme mantığı tek yerde kalır ve `resources.tsx`'teki
"dokümanlar bilerek config dışında" notu geçerliliğini korur.

### C4. Backend

Ek uç gerekmez; B2'nin `project_id` filtresi yeterlidir.

---

## Kapsam dışı

- `armonitex-web/` ve müşteri portalı davranışı.
- `ProjectRead` / `FinancialRecordRead` / portal uçlarının cevap şekli.
- `admin.py`'nin kaynak başına router'lara bölünmesi (ayrı iş).
- Otomatik test altyapısı (bu depoda bilinçli olarak yok).

## Doğrulama

- `admin-panel/`: `npm run lint` ve `npm run build` (tsc + vite) temiz geçmeli.
- `backend/`: `ruff check .` ve `black --check .` temiz geçmeli.
- Elle kontrol: kayıtlı e-posta ile kullanıcı oluşturmayı dene → 409 mesajı ekranda görünmeli;
  projeler listesinde müşteri adı görünmeli ve tıklanınca kullanıcı kaydına gitmeli.

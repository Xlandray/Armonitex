import { Tag, Typography } from "antd";
import dayjs from "dayjs";
import type { ReactNode } from "react";

// Merkezi kaynak tanimlari: her admin sekmesinin kolonlari ve form alanlari
// burada tanimlanir. Liste/form sayfalari bu config'i okuyup render eder.
//
// NOT: admin/documents bilerek burada degil — dosya yukleme (multipart) ve proje
// bazli filtreleme bu config sistemine sigmiyor. Elle yazilmis sayfasi ve kendi
// rotasi var: pages/DocumentsPage.tsx + App.tsx. Buraya kayit olarak eklemeyin.

export type ColumnDef = {
  dataIndex: string;
  title: string;
  ellipsis?: boolean;
  render?: (value: unknown, record: Record<string, unknown>) => ReactNode;
};

export type FieldType =
  | "text"
  | "textarea"
  | "password"
  | "number"
  | "switch"
  | "select"
  | "date"
  | "json"
  | "resourceSelect";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  placeholder?: string;
  initialValue?: unknown;
  min?: number; // password min length / number min
  options?: { value: string; label: string }[];
  // resourceSelect icin:
  optionsResource?: string;
  optionLabel?: (record: Record<string, unknown>) => string;
  optionFilter?: (record: Record<string, unknown>) => boolean;
};

export type ResourceConfig = {
  name: string; // "admin/users"
  path: string; // "users"
  label: string;
  columns: ColumnDef[];
  fields: { create: FieldDef[]; edit: FieldDef[] };
  canCreate?: boolean;
  canDelete?: boolean;
};

// --- ortak render yardimcilari ---

const STATUS_LABELS: Record<string, string> = {
  teklif: "Teklif",
  onaylandi: "Onaylandı",
  uretimde: "Üretimde",
  tamamlandi: "Tamamlandı",
  iptal: "İptal",
  bekliyor: "Bekliyor",
  reddedildi: "Reddedildi",
  odendi: "Ödendi",
  gecikti: "Gecikti",
};

const STATUS_COLORS: Record<string, string> = {
  teklif: "blue",
  onaylandi: "green",
  uretimde: "gold",
  tamamlandi: "success",
  iptal: "red",
  bekliyor: "gold",
  reddedildi: "red",
  odendi: "green",
  gecikti: "red",
};

const fmtDate = (value: unknown): ReactNode =>
  value ? dayjs(value as string).format("DD.MM.YYYY") : "—";

const fmtDateTime = (value: unknown): ReactNode =>
  value ? dayjs(value as string).format("DD.MM.YYYY HH:mm") : "—";

const boolTag = (value: unknown, yes: string, no: string): ReactNode => (
  <Tag color={value ? "green" : "default"}>{value ? yes : no}</Tag>
);

const statusTag = (value: unknown): ReactNode => {
  const key = String(value ?? "");
  return <Tag color={STATUS_COLORS[key] ?? "default"}>{STATUS_LABELS[key] ?? (key || "—")}</Tag>;
};

const typeTag = (value: unknown): ReactNode =>
  value === "invoice" ? (
    <Tag color="purple">Fatura</Tag>
  ) : (
    <Tag color="blue">Teklif</Tag>
  );

const jsonCell = (value: unknown): ReactNode => (
  <Typography.Text code ellipsis style={{ maxWidth: 320 }}>
    {JSON.stringify(value)}
  </Typography.Text>
);

const dash = (value: unknown): ReactNode =>
  value === null || value === undefined || value === "" ? "—" : String(value);

// --- kaynak tanimlari ---

const PROJECT_STATUS_OPTIONS = [
  { value: "teklif", label: "Teklif" },
  { value: "onaylandi", label: "Onaylandı" },
  { value: "uretimde", label: "Üretimde" },
  { value: "tamamlandi", label: "Tamamlandı" },
  { value: "iptal", label: "İptal" },
];

const FINANCIAL_STATUS_OPTIONS = [
  { value: "bekliyor", label: "Bekliyor" },
  { value: "onaylandi", label: "Onaylandı (teklif)" },
  { value: "reddedildi", label: "Reddedildi (teklif)" },
  { value: "odendi", label: "Ödendi (fatura)" },
  { value: "gecikti", label: "Gecikti (fatura)" },
];

const CURRENCY_OPTIONS = [
  { value: "TRY", label: "TRY (₺)" },
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
];

const customerLabel = (u: Record<string, unknown>): string => {
  const email = String(u.email ?? "");
  const name = u.full_name ? `${String(u.full_name)} · ` : "";
  return `${name}${email}`;
};

const projectLabel = (p: Record<string, unknown>): string => {
  const title = String(p.title ?? "");
  return p.reference_no ? `${title} (${String(p.reference_no)})` : title;
};

export const RESOURCES: ResourceConfig[] = [
  {
    name: "admin/contents",
    path: "contents",
    label: "İçerikler",
    columns: [
      { dataIndex: "title", title: "Başlık", ellipsis: true },
      { dataIndex: "slug", title: "Slug", ellipsis: true },
      {
        dataIndex: "is_published",
        title: "Durum",
        render: (v) => boolTag(v, "Yayında", "Taslak"),
      },
      { dataIndex: "updated_at", title: "Güncellendi", render: fmtDateTime },
    ],
    fields: {
      create: [
        { name: "title", label: "Başlık", type: "text", required: true },
        {
          name: "slug",
          label: "Slug",
          type: "text",
          required: true,
          help: "Küçük harf, rakam ve tire (ör. hakkimizda).",
        },
        { name: "body", label: "İçerik", type: "textarea", required: true },
        { name: "is_published", label: "Yayında", type: "switch", initialValue: false },
      ],
      edit: [
        { name: "title", label: "Başlık", type: "text", required: true },
        {
          name: "slug",
          label: "Slug",
          type: "text",
          required: true,
          help: "Küçük harf, rakam ve tire (ör. hakkimizda).",
        },
        { name: "body", label: "İçerik", type: "textarea", required: true },
        { name: "is_published", label: "Yayında", type: "switch" },
      ],
    },
  },
  {
    name: "admin/settings",
    path: "settings",
    label: "Ayarlar",
    columns: [
      { dataIndex: "key", title: "Anahtar" },
      { dataIndex: "value", title: "Değer", render: jsonCell },
      { dataIndex: "description", title: "Açıklama", ellipsis: true, render: dash },
    ],
    fields: {
      create: [
        {
          name: "key",
          label: "Anahtar",
          type: "text",
          required: true,
          help: "Küçük harfle başlar; harf, rakam, alt çizgi (ör. contact_info).",
        },
        {
          name: "value",
          label: "Değer (JSON)",
          type: "json",
          required: true,
          help: 'JSON nesnesi girin, ör. {"phone": "0216..."}.',
        },
        { name: "description", label: "Açıklama", type: "text" },
      ],
      edit: [
        {
          name: "value",
          label: "Değer (JSON)",
          type: "json",
          required: true,
          help: 'JSON nesnesi girin, ör. {"phone": "0216..."}.',
        },
        { name: "description", label: "Açıklama", type: "text" },
      ],
    },
  },
  {
    name: "admin/users",
    path: "users",
    label: "Kullanıcılar",
    columns: [
      { dataIndex: "email", title: "E-posta" },
      { dataIndex: "full_name", title: "Ad Soyad", render: dash },
      { dataIndex: "is_customer", title: "Müşteri", render: (v) => boolTag(v, "Müşteri", "—") },
      {
        dataIndex: "is_superuser",
        title: "Yönetici",
        render: (v) => (v ? <Tag color="volcano">Admin</Tag> : "—"),
      },
      { dataIndex: "is_active", title: "Aktif", render: (v) => boolTag(v, "Aktif", "Pasif") },
      { dataIndex: "created_at", title: "Oluşturuldu", render: fmtDate },
    ],
    fields: {
      create: [
        { name: "email", label: "E-posta", type: "text", required: true },
        { name: "full_name", label: "Ad Soyad", type: "text" },
        {
          name: "password",
          label: "Şifre",
          type: "password",
          required: true,
          min: 12,
          help: "En az 12 karakter.",
        },
        {
          name: "is_customer",
          label: "Müşteri hesabı",
          type: "switch",
          initialValue: true,
          help: "Portala giriş yapabilen müşteri hesabı.",
        },
      ],
      edit: [
        { name: "full_name", label: "Ad Soyad", type: "text" },
        { name: "is_active", label: "Aktif", type: "switch" },
        { name: "is_superuser", label: "Yönetici (admin)", type: "switch" },
        { name: "is_customer", label: "Müşteri hesabı", type: "switch" },
        {
          name: "password",
          label: "Yeni şifre (sıfırlama)",
          type: "password",
          min: 12,
          help: "Şifreyi sıfırlamak için yeni şifre girin. Boş bırakırsan değişmez.",
        },
      ],
    },
  },
  {
    name: "admin/projects",
    path: "projects",
    label: "Projeler",
    columns: [
      { dataIndex: "title", title: "Proje", ellipsis: true },
      { dataIndex: "reference_no", title: "Referans", render: dash },
      { dataIndex: "status", title: "Durum", render: statusTag },
      { dataIndex: "customer_id", title: "Müşteri ID", ellipsis: true },
      { dataIndex: "created_at", title: "Oluşturuldu", render: fmtDate },
    ],
    fields: {
      create: [
        {
          name: "customer_id",
          label: "Müşteri",
          type: "resourceSelect",
          required: true,
          optionsResource: "admin/users",
          optionFilter: (u) => Boolean(u.is_customer),
          optionLabel: customerLabel,
          help: "Sadece müşteri hesapları listelenir.",
        },
        { name: "title", label: "Proje adı", type: "text", required: true },
        { name: "description", label: "Açıklama", type: "textarea" },
        { name: "reference_no", label: "Referans no", type: "text" },
        {
          name: "status",
          label: "Durum",
          type: "select",
          options: PROJECT_STATUS_OPTIONS,
          initialValue: "teklif",
        },
      ],
      edit: [
        { name: "title", label: "Proje adı", type: "text", required: true },
        { name: "description", label: "Açıklama", type: "textarea" },
        { name: "reference_no", label: "Referans no", type: "text" },
        { name: "status", label: "Durum", type: "select", options: PROJECT_STATUS_OPTIONS },
      ],
    },
  },
  {
    name: "admin/financial-records",
    path: "financial-records",
    label: "Teklif/Fatura",
    columns: [
      { dataIndex: "type", title: "Tür", render: typeTag },
      { dataIndex: "number", title: "No" },
      {
        dataIndex: "amount",
        title: "Tutar",
        render: (v, r) => `${v} ${String(r.currency ?? "")}`,
      },
      { dataIndex: "status", title: "Durum", render: statusTag },
      { dataIndex: "issue_date", title: "Düzenleme", render: fmtDate },
      { dataIndex: "due_date", title: "Vade", render: fmtDate },
    ],
    fields: {
      create: [
        {
          name: "project_id",
          label: "Proje",
          type: "resourceSelect",
          required: true,
          optionsResource: "admin/projects",
          optionLabel: projectLabel,
        },
        {
          name: "type",
          label: "Tür",
          type: "select",
          required: true,
          options: [
            { value: "quote", label: "Teklif" },
            { value: "invoice", label: "Fatura" },
          ],
          initialValue: "quote",
        },
        { name: "number", label: "Belge no", type: "text", required: true },
        { name: "amount", label: "Tutar", type: "number", required: true, min: 0 },
        {
          name: "currency",
          label: "Para birimi",
          type: "select",
          options: CURRENCY_OPTIONS,
          initialValue: "TRY",
        },
        {
          name: "status",
          label: "Durum",
          type: "select",
          required: true,
          options: FINANCIAL_STATUS_OPTIONS,
          initialValue: "bekliyor",
        },
        { name: "issue_date", label: "Düzenleme tarihi", type: "date" },
        { name: "due_date", label: "Vade tarihi", type: "date" },
      ],
      edit: [
        { name: "number", label: "Belge no", type: "text", required: true },
        { name: "amount", label: "Tutar", type: "number", required: true, min: 0 },
        { name: "currency", label: "Para birimi", type: "select", options: CURRENCY_OPTIONS },
        {
          name: "status",
          label: "Durum",
          type: "select",
          options: FINANCIAL_STATUS_OPTIONS,
        },
        { name: "issue_date", label: "Düzenleme tarihi", type: "date" },
        { name: "due_date", label: "Vade tarihi", type: "date" },
      ],
    },
  },
];

export const getResourceConfig = (name: string): ResourceConfig | undefined =>
  RESOURCES.find((r) => r.name === name);

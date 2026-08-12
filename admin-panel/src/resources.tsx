import { Tag } from "antd";
import type { ReactNode } from "react";

import {
  boolTag,
  customerLabel,
  dash,
  fmtDate,
  fmtDateTime,
  jsonCell,
  money,
  projectLabel,
  statusTag,
  typeTag,
} from "./display";

// Merkezi kaynak tanimlari: her admin sekmesinin kolonlari ve form alanlari
// burada tanimlanir. Liste/form sayfalari bu config'i okuyup render eder.
//
// NOT: admin/documents bilerek burada degil — dosya yukleme (multipart) ve proje
// bazli filtreleme bu config sistemine sigmiyor. Yukleme/listeleme bilesen olarak
// components/ProjectDocuments.tsx'te; sekme sayfasi pages/DocumentsPage.tsx,
// rotasi App.tsx'te. Buraya kayit olarak eklemeyin.

export type ColumnDef = {
  dataIndex: string;
  title: string;
  ellipsis?: boolean;
  // sortable: dataIndex ayni zamanda API'nin siralama anahtaridir; backend'de
  // ilgili kaynagin Literal beyaz listesinde bulunmali.
  sortable?: boolean;
  // filter: tek secimli kolon filtresi; deger dogrudan query param olur.
  filter?: { options: { value: string; label: string }[] };
  // linkTo: hucreyi bir kayda goturur.
  linkTo?: (record: Record<string, unknown>) => string;
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
  // searchable: liste basligina arama kutusu koyar; API'ye ?q= olarak gider.
  searchable?: boolean;
  // hasShow: kaynagin ayri bir detay ekrani var (rotasi App.tsx'te elle
  // tanimlidir, config'ten uretilmez).
  hasShow?: boolean;
};

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

// Ic ice gelen ozet nesneler (AdminProjectRead.customer,
// AdminFinancialRecordRead.project) icin ortak okuma/etiketleme.
type Brief = { id: string } & Record<string, unknown>;

const asBrief = (value: unknown): Brief | undefined =>
  value && typeof value === "object" ? (value as Brief) : undefined;

const briefCell =
  (label: (record: Record<string, unknown>) => string) =>
  (value: unknown): ReactNode => {
    const brief = asBrief(value);
    return brief ? label(brief) : "—";
  };

const briefLink =
  (path: string, key: string) =>
  (record: Record<string, unknown>): string =>
    `${path}/${asBrief(record[key])?.id ?? ""}`;

const boolFilter = (yes: string, no: string) => ({
  options: [
    { value: "true", label: yes },
    { value: "false", label: no },
  ],
});

export const RESOURCES: ResourceConfig[] = [
  {
    name: "admin/contents",
    path: "contents",
    label: "İçerikler",
    searchable: true,
    columns: [
      { dataIndex: "title", title: "Başlık", ellipsis: true, sortable: true },
      { dataIndex: "slug", title: "Slug", ellipsis: true },
      {
        dataIndex: "is_published",
        title: "Durum",
        render: (v) => boolTag(v, "Yayında", "Taslak"),
        filter: boolFilter("Yayında", "Taslak"),
      },
      { dataIndex: "updated_at", title: "Güncellendi", render: fmtDateTime, sortable: true },
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
    searchable: true,
    columns: [
      { dataIndex: "key", title: "Anahtar", sortable: true },
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
    searchable: true,
    columns: [
      { dataIndex: "email", title: "E-posta", sortable: true },
      { dataIndex: "full_name", title: "Ad Soyad", render: dash },
      {
        dataIndex: "is_customer",
        title: "Müşteri",
        render: (v) => boolTag(v, "Müşteri", "—"),
        filter: boolFilter("Müşteri", "Müşteri değil"),
      },
      {
        dataIndex: "is_superuser",
        title: "Yönetici",
        render: (v) => (v ? <Tag color="volcano">Admin</Tag> : "—"),
        filter: boolFilter("Yönetici", "Yönetici değil"),
      },
      {
        dataIndex: "is_active",
        title: "Aktif",
        render: (v) => boolTag(v, "Aktif", "Pasif"),
        filter: boolFilter("Aktif", "Pasif"),
      },
      { dataIndex: "created_at", title: "Oluşturuldu", render: fmtDate, sortable: true },
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
    searchable: true,
    hasShow: true,
    columns: [
      {
        dataIndex: "title",
        title: "Proje",
        ellipsis: true,
        sortable: true,
        linkTo: (r) => `/projects/show/${String(r.id)}`,
      },
      { dataIndex: "reference_no", title: "Referans", render: dash },
      {
        dataIndex: "status",
        title: "Durum",
        render: statusTag,
        sortable: true,
        filter: { options: PROJECT_STATUS_OPTIONS },
      },
      {
        dataIndex: "customer",
        title: "Müşteri",
        ellipsis: true,
        render: briefCell(customerLabel),
        linkTo: briefLink("/users/edit", "customer"),
      },
      { dataIndex: "created_at", title: "Oluşturuldu", render: fmtDate, sortable: true },
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
    searchable: true,
    columns: [
      {
        dataIndex: "type",
        title: "Tür",
        render: typeTag,
        filter: {
          options: [
            { value: "quote", label: "Teklif" },
            { value: "invoice", label: "Fatura" },
          ],
        },
      },
      { dataIndex: "number", title: "No" },
      {
        dataIndex: "project",
        title: "Proje",
        ellipsis: true,
        render: briefCell(projectLabel),
        linkTo: briefLink("/projects/show", "project"),
      },
      {
        dataIndex: "amount",
        title: "Tutar",
        sortable: true,
        render: (v, r) => money(v, r.currency),
      },
      {
        dataIndex: "status",
        title: "Durum",
        render: statusTag,
        filter: { options: FINANCIAL_STATUS_OPTIONS },
      },
      { dataIndex: "issue_date", title: "Düzenleme", render: fmtDate, sortable: true },
      { dataIndex: "due_date", title: "Vade", render: fmtDate, sortable: true },
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

import { Tag, Typography } from "antd";
import dayjs from "dayjs";
import type { ReactNode } from "react";

// Listelerin ve detay ekranlarinin ortak gosterim yardimcilari. Durum
// etiketleri iki yerde kopyalanmasin diye burada tek merkezde duruyor.

export const STATUS_LABELS: Record<string, string> = {
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

export const STATUS_COLORS: Record<string, string> = {
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

export const fmtDate = (value: unknown): ReactNode =>
  value ? dayjs(value as string).format("DD.MM.YYYY") : "—";

export const fmtDateTime = (value: unknown): ReactNode =>
  value ? dayjs(value as string).format("DD.MM.YYYY HH:mm") : "—";

export const boolTag = (value: unknown, yes: string, no: string): ReactNode => (
  <Tag color={value ? "green" : "default"}>{value ? yes : no}</Tag>
);

export const statusTag = (value: unknown): ReactNode => {
  const key = String(value ?? "");
  return <Tag color={STATUS_COLORS[key] ?? "default"}>{STATUS_LABELS[key] ?? (key || "—")}</Tag>;
};

export const typeTag = (value: unknown): ReactNode =>
  value === "invoice" ? <Tag color="purple">Fatura</Tag> : <Tag color="blue">Teklif</Tag>;

export const jsonCell = (value: unknown): ReactNode => (
  <Typography.Text code ellipsis style={{ maxWidth: 320 }}>
    {JSON.stringify(value)}
  </Typography.Text>
);

export const dash = (value: unknown): ReactNode =>
  value === null || value === undefined || value === "" ? "—" : String(value);

export const formatSize = (bytes: unknown): string => {
  const size = Number(bytes ?? 0);
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
};

export const money = (amount: unknown, currency: unknown): string =>
  `${String(amount ?? "")} ${String(currency ?? "")}`.trim();

export const customerLabel = (user: Record<string, unknown>): string => {
  const email = String(user.email ?? "");
  const name = user.full_name ? `${String(user.full_name)} · ` : "";
  return `${name}${email}`;
};

export const projectLabel = (project: Record<string, unknown>): string => {
  const title = String(project.title ?? "");
  return project.reference_no ? `${title} (${String(project.reference_no)})` : title;
};

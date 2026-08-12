import { useCreate, useOne, useUpdate } from "@refinedev/core";
import type { HttpError } from "@refinedev/core";
import { Create, Edit } from "@refinedev/antd";
import { DatePicker, Form, Input, InputNumber, Select, Switch, message } from "antd";
import type { Rule } from "antd/es/form";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";

import { axiosInstance } from "../providers/axios";
import type { FieldDef, ResourceConfig } from "../resources";
import { errorMessage } from "../utils/errors";

type Mode = "create" | "edit";

type Option = { value: string; label: string };
type PageResponse = { data: Record<string, unknown>[]; total: number };

// resourceSelect: baska bir kaynaktan secenek yukleyen dropdown.
// Form.Item value/onChange proplarini Select'e aktarmak icin rest yayilir.
function ResourceSelect({ field, ...rest }: { field: FieldDef }) {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get<PageResponse>(`/${field.optionsResource}`, { params: { page_size: 100 } })
      .then((res) => {
        const rows = res.data.data;
        const filtered = field.optionFilter ? rows.filter(field.optionFilter) : rows;
        setOptions(
          filtered.map((r) => ({
            value: String(r.id),
            label: field.optionLabel ? field.optionLabel(r) : String(r.id),
          })),
        );
      })
      .catch((error) => message.error(errorMessage(error, "Seçenekler yüklenemedi.")))
      .finally(() => setLoading(false));
  }, [field]);

  return (
    <Select
      showSearch
      optionFilterProp="label"
      loading={loading}
      options={options}
      placeholder="Seçin"
      {...rest}
    />
  );
}

function renderInput(field: FieldDef) {
  switch (field.type) {
    case "textarea":
      return <Input.TextArea autoSize={{ minRows: 4 }} placeholder={field.placeholder} />;
    case "password":
      return <Input.Password autoComplete="new-password" placeholder={field.placeholder} />;
    case "number":
      return <InputNumber style={{ width: "100%" }} min={field.min} step={0.01} />;
    case "switch":
      return <Switch />;
    case "select":
      return <Select options={field.options} placeholder="Seçin" allowClear />;
    case "date":
      return <DatePicker style={{ width: "100%" }} format="DD.MM.YYYY" />;
    case "json":
      return <Input.TextArea autoSize={{ minRows: 6 }} spellCheck={false} />;
    case "resourceSelect":
      return <ResourceSelect field={field} />;
    default:
      return <Input placeholder={field.placeholder} />;
  }
}

function buildRules(field: FieldDef): Rule[] {
  const rules: Rule[] = [];
  if (field.required && field.type !== "switch") {
    rules.push({ required: true, message: `${field.label} zorunludur.` });
  }
  if (field.min && field.type === "password") {
    rules.push({
      validator: (_, value) =>
        !value || String(value).length >= field.min!
          ? Promise.resolve()
          : Promise.reject(new Error(`En az ${field.min} karakter.`)),
    });
  }
  return rules;
}

// Form degerlerini API payload'ina cevirir. JSON parse hatasinda null doner.
function toPayload(fields: FieldDef[], values: Record<string, unknown>): Record<string, unknown> | null {
  const payload: Record<string, unknown> = {};
  for (const field of fields) {
    const v = values[field.name];
    if (field.type === "switch") {
      payload[field.name] = Boolean(v);
      continue;
    }
    if (field.type === "json") {
      if (v === undefined || v === "") {
        if (field.required) {
          message.error(`${field.label} zorunludur.`);
          return null;
        }
        continue;
      }
      try {
        const parsed: unknown = JSON.parse(String(v));
        if (parsed === null || Array.isArray(parsed) || typeof parsed !== "object") {
          throw new Error("not an object");
        }
        payload[field.name] = parsed;
      } catch {
        message.error(`${field.label}: geçerli bir JSON nesnesi girin.`);
        return null;
      }
      continue;
    }
    if (field.type === "date") {
      if (v) payload[field.name] = dayjs(v as dayjs.Dayjs).format("YYYY-MM-DD");
      continue;
    }
    if (field.type === "number") {
      if (v !== undefined && v !== null) payload[field.name] = v;
      continue;
    }
    const isBlank = v === undefined || v === null || v === "";

    // text / textarea: bos birakmak "alani temizle" demek -> null gonderilir.
    // Backend'de bu alanlar str | None; bos string min_length'e takilirdi.
    if (field.type === "text" || field.type === "textarea") {
      if (isBlank) {
        if (!field.required) payload[field.name] = null;
        continue;
      }
      payload[field.name] = v;
      continue;
    }

    // password / select / resourceSelect: bos birakilan alan hic gonderilmez,
    // boylece bos birakilan sifre alani mevcut sifreyi degistirmez.
    if (isBlank) continue;
    payload[field.name] = v;
  }
  return payload;
}

export function ResourceFormPage({ config, mode }: { config: ResourceConfig; mode: Mode }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const fields = config.fields[mode];
  const listPath = `/${config.path}`;

  const { mutate: createRecord, mutation: createMutation } = useCreate();
  const { mutate: updateRecord, mutation: updateMutation } = useUpdate();
  const { query } = useOne<Record<string, unknown>>({
    resource: config.name,
    id: id ?? "",
    queryOptions: { enabled: mode === "edit" && Boolean(id) },
  });

  // Create modunda alanlar config'teki initialValue ile, ustune de query
  // param'la on-secilebilir: /financial-records/create?project_id=... gibi.
  // Yalnizca bu formda tanimli alanlar okunur.
  const initialValues =
    mode === "create"
      ? {
          ...Object.fromEntries(
            fields.filter((f) => f.initialValue !== undefined).map((f) => [f.name, f.initialValue]),
          ),
          ...Object.fromEntries(
            fields
              .filter((f) => searchParams.has(f.name))
              .map((f) => [f.name, searchParams.get(f.name)]),
          ),
        }
      : undefined;

  useEffect(() => {
    if (mode !== "edit" || !query.data?.data) return;
    const record = query.data.data;
    const next: Record<string, unknown> = {};
    for (const field of fields) {
      if (field.type === "password") continue; // sifre asla on-doldurulmaz
      const raw = record[field.name];
      if (field.type === "date") next[field.name] = raw ? dayjs(raw as string) : undefined;
      else if (field.type === "json")
        next[field.name] = raw !== undefined ? JSON.stringify(raw, null, 2) : "";
      else next[field.name] = raw;
    }
    form.setFieldsValue(next);
  }, [form, mode, query.data, fields]);

  // axios interceptor'i 422 govdesini HttpError.errors'a cevirir; buradaki is
  // sadece o haritayi formdaki alanlara baglamak. Genel mesaji zaten
  // notificationProvider gosteriyor.
  const applyFieldErrors = (error: HttpError) => {
    const fieldNames = new Set(fields.map((f) => f.name));
    const entries = Object.entries(error?.errors ?? {})
      .filter(([name]) => fieldNames.has(name))
      .map(([name, value]) => ({
        name,
        errors: (Array.isArray(value) ? value : [value]).map(String),
      }));
    if (entries.length > 0) form.setFields(entries);
  };

  const submit = (values: Record<string, unknown>) => {
    const payload = toPayload(fields, values);
    if (!payload) return;
    if (mode === "create") {
      createRecord(
        { resource: config.name, values: payload },
        { onSuccess: () => navigate(listPath), onError: applyFieldErrors },
      );
      return;
    }
    updateRecord(
      { resource: config.name, id: id ?? "", values: payload },
      { onSuccess: () => navigate(listPath), onError: applyFieldErrors },
    );
  };

  const body = (
    <Form form={form} layout="vertical" initialValues={initialValues} onFinish={submit}>
      {fields.map((field) => (
        <Form.Item
          key={field.name}
          name={field.name}
          label={field.label}
          extra={field.help}
          rules={buildRules(field)}
          valuePropName={field.type === "switch" ? "checked" : "value"}
        >
          {renderInput(field)}
        </Form.Item>
      ))}
    </Form>
  );

  const title = mode === "create" ? `${config.label} · Oluştur` : `${config.label} · Düzenle`;

  return mode === "create" ? (
    <Create title={title} saveButtonProps={{ loading: createMutation.isPending, onClick: form.submit }}>
      {body}
    </Create>
  ) : (
    <Edit
      title={title}
      saveButtonProps={{ loading: updateMutation.isPending, onClick: form.submit }}
    >
      {body}
    </Edit>
  );
}

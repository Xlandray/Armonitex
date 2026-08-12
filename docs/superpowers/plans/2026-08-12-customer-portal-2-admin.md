# Müşteri Portalı — Plan 2/3: Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let staff manage portal data from the existing Refine admin panel: create customer accounts, CRUD projects and financial records, and upload/list/delete project documents.

**Architecture:** Reuse the existing generic `ResourceListPage` + `JsonResourceFormPage` for JSON resources (projects, financial-records) and enable user creation. Documents need `multipart/form-data`, so add one dedicated `DocumentsPage` that talks to the API via the existing `axiosInstance` (no dataProvider change needed).

**Tech Stack:** Refine 6, Ant Design 5, Vite, React Router, axios.

**Prereq:** Plan 1 (backend) merged — the admin endpoints `POST /admin/users`, `projects`, `financial-records`, `documents` must exist.

**Spec:** `docs/superpowers/specs/2026-08-12-customer-portal-design.md`

**Testing note:** Admin panel has no unit tests; verification is `npm run build` (`tsc -b`) + manual click-through against the running stack.

---

## File Structure

**Modify:**
- `admin-panel/src/App.tsx` — register resources + routes; enable user create
- `admin-panel/src/pages/JsonResourceFormPage.tsx` — `writableFields` for new resources + user create

**Create:**
- `admin-panel/src/pages/DocumentsPage.tsx` — project-scoped list + upload + delete

---

## Task 1: JsonResourceFormPage — writable fields for new resources

**Files:**
- Modify: `admin-panel/src/pages/JsonResourceFormPage.tsx:15-28`

- [ ] **Step 1: Extend the `writableFields` map**

Replace the `writableFields` object with:

```typescript
const writableFields: Record<string, Record<JsonResourceFormPageProps["mode"], string[]>> = {
  "admin/contents": {
    create: ["title", "slug", "body", "is_published"],
    edit: ["title", "slug", "body", "is_published"],
  },
  "admin/settings": {
    create: ["key", "value", "description"],
    edit: ["value", "description"],
  },
  "admin/users": {
    create: ["email", "full_name", "password", "is_customer"],
    edit: ["full_name", "is_active", "is_superuser", "is_customer"],
  },
  "admin/projects": {
    create: ["customer_id", "title", "description", "reference_no", "status"],
    edit: ["title", "description", "reference_no", "status"],
  },
  "admin/financial-records": {
    create: [
      "project_id",
      "type",
      "number",
      "amount",
      "currency",
      "status",
      "issue_date",
      "due_date",
      "document_id",
    ],
    edit: ["number", "amount", "currency", "status", "issue_date", "due_date", "document_id"],
  },
};
```

- [ ] **Step 2: Verify types compile**

Run: `cd admin-panel && npx tsc -b`
Expected: no type errors.

- [ ] **Step 3: Commit**

```bash
git add admin-panel/src/pages/JsonResourceFormPage.tsx
git commit -m "feat(admin): writable fields for users(create), projects, financial-records"
```

---

## Task 2: DocumentsPage — project-scoped upload/list/delete

**Files:**
- Create: `admin-panel/src/pages/DocumentsPage.tsx`

- [ ] **Step 1: Implement the page**

```tsx
import { useEffect, useState } from "react";
import { Button, Card, Popconfirm, Select, Space, Table, Upload, message } from "antd";
import type { UploadFile } from "antd";

import { axiosInstance } from "../providers/axios";

type ProjectRecord = { id: string; title: string; reference_no: string | null };
type DocumentRecord = {
  id: string;
  original_filename: string;
  content_type: string;
  size_bytes: number;
  created_at: string;
};
type PageResponse<T> = { data: T[]; total: number };

export function DocumentsPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [projectId, setProjectId] = useState<string | undefined>();
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    axiosInstance
      .get<PageResponse<ProjectRecord>>("/admin/projects", { params: { page_size: 100 } })
      .then((res) => setProjects(res.data.data))
      .catch(() => message.error("Projeler yüklenemedi."));
  }, []);

  const loadDocuments = (id: string) => {
    axiosInstance
      .get<PageResponse<DocumentRecord>>("/admin/documents", {
        params: { project_id: id, page_size: 100 },
      })
      .then((res) => setDocuments(res.data.data))
      .catch(() => message.error("Dokümanlar yüklenemedi."));
  };

  const onSelectProject = (id: string) => {
    setProjectId(id);
    loadDocuments(id);
  };

  const onUpload = async () => {
    if (!projectId || fileList.length === 0) return;
    const form = new FormData();
    form.append("project_id", projectId);
    form.append("file", fileList[0] as unknown as Blob);
    setUploading(true);
    try {
      await axiosInstance.post("/admin/documents", form);
      message.success("Doküman yüklendi.");
      setFileList([]);
      loadDocuments(projectId);
    } catch {
      message.error("Yükleme başarısız.");
    } finally {
      setUploading(false);
    }
  };

  const onDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/admin/documents/${id}`);
      if (projectId) loadDocuments(projectId);
    } catch {
      message.error("Silme başarısız.");
    }
  };

  return (
    <Card title="Dokümanlar">
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Select
          style={{ width: 420 }}
          placeholder="Proje seçin"
          value={projectId}
          onChange={onSelectProject}
          options={projects.map((p) => ({
            value: p.id,
            label: p.reference_no ? `${p.title} (${p.reference_no})` : p.title,
          }))}
        />

        {projectId ? (
          <Space>
            <Upload
              beforeUpload={(file) => {
                setFileList([file]);
                return false;
              }}
              onRemove={() => setFileList([])}
              fileList={fileList}
              maxCount={1}
            >
              <Button>Dosya seç</Button>
            </Upload>
            <Button
              type="primary"
              onClick={onUpload}
              loading={uploading}
              disabled={fileList.length === 0}
            >
              Yükle
            </Button>
          </Space>
        ) : null}

        <Table<DocumentRecord> dataSource={documents} rowKey="id" pagination={false}>
          <Table.Column<DocumentRecord> dataIndex="original_filename" title="Dosya" />
          <Table.Column<DocumentRecord> dataIndex="content_type" title="Tür" />
          <Table.Column<DocumentRecord> dataIndex="size_bytes" title="Boyut (bayt)" />
          <Table.Column<DocumentRecord>
            title="İşlemler"
            render={(_, record) => (
              <Popconfirm
                cancelText="Vazgeç"
                okText="Sil"
                title="Bu doküman silinsin mi?"
                onConfirm={() => onDelete(record.id)}
              >
                <Button danger>Sil</Button>
              </Popconfirm>
            )}
          />
        </Table>
      </Space>
    </Card>
  );
}
```

- [ ] **Step 2: Verify compile**

Run: `cd admin-panel && npx tsc -b`
Expected: no type errors.

- [ ] **Step 3: Commit**

```bash
git add admin-panel/src/pages/DocumentsPage.tsx
git commit -m "feat(admin): documents page with project-scoped upload/list/delete"
```

---

## Task 3: Register resources + routes in App.tsx

**Files:**
- Modify: `admin-panel/src/App.tsx`

- [ ] **Step 1: Import DocumentsPage**

Add after the `ResourceListPage` import:

```typescript
import { DocumentsPage } from "./pages/DocumentsPage";
```

- [ ] **Step 2: Extend the `resources` array**

Add these entries to the `resources` array (after `admin/users`):

```typescript
  {
    name: "admin/projects",
    list: "/projects",
    create: "/projects/create",
    edit: "/projects/edit/:id",
    meta: { label: "Projeler" },
  },
  {
    name: "admin/financial-records",
    list: "/financial-records",
    create: "/financial-records/create",
    edit: "/financial-records/edit/:id",
    meta: { label: "Teklif/Fatura" },
  },
  {
    name: "admin/documents",
    list: "/documents",
    meta: { label: "Dokümanlar" },
  },
```

- [ ] **Step 3: Enable user creation**

Replace the `admin/users` `<Route path="/users" ...>` element and add a create route:

```tsx
                <Route
                  path="/users"
                  element={<ResourceListPage resource="admin/users" title="Kullanıcılar" />}
                />
                <Route
                  path="/users/create"
                  element={
                    <JsonResourceFormPage
                      resource="admin/users"
                      title="Kullanıcı oluştur"
                      mode="create"
                    />
                  }
                />
```

(Removing `canCreate={false} canDelete={false}` restores the create/delete buttons; the backend now supports both.)

- [ ] **Step 4: Add project, financial-record, document routes**

Insert before the `<Route path="*" element={<ErrorComponent />} />` line:

```tsx
                <Route
                  path="/projects"
                  element={<ResourceListPage resource="admin/projects" title="Projeler" />}
                />
                <Route
                  path="/projects/create"
                  element={
                    <JsonResourceFormPage
                      resource="admin/projects"
                      title="Proje oluştur"
                      mode="create"
                    />
                  }
                />
                <Route
                  path="/projects/edit/:id"
                  element={
                    <JsonResourceFormPage
                      resource="admin/projects"
                      title="Proje düzenle"
                      mode="edit"
                    />
                  }
                />
                <Route
                  path="/financial-records"
                  element={
                    <ResourceListPage
                      resource="admin/financial-records"
                      title="Teklif/Fatura"
                    />
                  }
                />
                <Route
                  path="/financial-records/create"
                  element={
                    <JsonResourceFormPage
                      resource="admin/financial-records"
                      title="Teklif/Fatura oluştur"
                      mode="create"
                    />
                  }
                />
                <Route
                  path="/financial-records/edit/:id"
                  element={
                    <JsonResourceFormPage
                      resource="admin/financial-records"
                      title="Teklif/Fatura düzenle"
                      mode="edit"
                    />
                  }
                />
                <Route path="/documents" element={<DocumentsPage />} />
```

- [ ] **Step 5: Verify build**

Run: `cd admin-panel && npm run build`
Expected: `tsc -b` + `vite build` succeed with no errors.

- [ ] **Step 6: Commit**

```bash
git add admin-panel/src/App.tsx
git commit -m "feat(admin): register projects, financial-records, documents resources + user create route"
```

---

## Task 4: Manual verification (running stack)

**Files:** none

- [ ] **Step 1: Run admin panel + api**

Run: `docker compose up -d api admin-panel` (or `cd admin-panel && npm run dev`).
Open `http://localhost:5180`, log in as the superuser.

- [ ] **Step 2: Click-through**

- Kullanıcılar → Oluştur → JSON `{ "email": "m2@example.com", "full_name": "M2", "password": "customer-pass-123", "is_customer": true }` → save → appears in list.
- Projeler → Oluştur → JSON with `customer_id` of that user, `title`, `status: "uretimde"` → save.
- Teklif/Fatura → Oluştur → JSON with `project_id`, `type: "quote"`, `number`, `amount: "1500.00"`, `status: "bekliyor"` → save.
- Dokümanlar → select the project → choose a file → Yükle → row appears → Sil works.

- [ ] **Step 3: Record results**

Note any failures (status codes in the browser devtools network tab). Do not mark complete unless all four resources create and list correctly.

---

## Self-Review (completed during planning)

- **Spec coverage:** spec §5 admin resources → Tasks 1–3; user create (email/password/is_customer) → Tasks 1 & 3; documents multipart via dedicated page → Task 2. All covered.
- **Type consistency:** `PageResponse<T>` shape matches backend `Page[...]` (`{data, total}`); resource names (`admin/projects`, `admin/financial-records`, `admin/documents`, `admin/users`) match backend routes and dataProvider path building (`/${resource}`).
- **Placeholders:** none — full component code provided.
- **Decision:** documents bypass the generic dataProvider (multipart) via `axiosInstance` directly; no dataProvider edits, keeping the JSON path untouched (low blast radius).
```

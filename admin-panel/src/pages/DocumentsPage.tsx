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

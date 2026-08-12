import { useCallback, useEffect, useState } from "react";
import { Button, Empty, Popconfirm, Space, Table, Upload, message } from "antd";
import type { TableProps, UploadFile } from "antd";

import { axiosInstance } from "../providers/axios";
import { fmtDateTime, formatSize } from "../display";
import { errorMessage } from "../utils/errors";

// Dokuman yukleme + listeleme, tek bir projeye bagli. Hem proje detay ekrani
// hem de Dokumanlar sekmesi bunu kullanir; yukleme mantigi tek yerde kalsin
// diye ayri bir bilesen. (Dokumanlar bilerek resources.tsx config sisteminde
// degil: multipart yukleme oraya sigmiyor.)

type DocumentRecord = {
  id: string;
  original_filename: string;
  content_type: string;
  size_bytes: number;
  created_at: string;
};

type PageResponse<T> = { data: T[]; total: number };

// Backend'in kabul ettigi siralama anahtarlari (schemas/document.py: DocumentSort).
type SortKey = "created_at" | "original_filename" | "size_bytes";
const DEFAULT_SORT = "-created_at";

export function ProjectDocuments({ projectId }: { projectId: string }) {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState<string>(DEFAULT_SORT);

  const load = useCallback(() => {
    setLoading(true);
    axiosInstance
      .get<PageResponse<DocumentRecord>>("/admin/documents", {
        params: { project_id: projectId, page_size: 100, sort },
      })
      .then((response) => setDocuments(response.data.data))
      .catch((error) => message.error(errorMessage(error, "Dokümanlar yüklenemedi.")))
      .finally(() => setLoading(false));
  }, [projectId, sort]);

  useEffect(() => {
    load();
  }, [load]);

  const onUpload = async () => {
    if (fileList.length === 0) return;
    const form = new FormData();
    form.append("project_id", projectId);
    form.append("file", fileList[0] as unknown as Blob);
    setUploading(true);
    try {
      await axiosInstance.post("/admin/documents", form);
      message.success("Doküman yüklendi.");
      setFileList([]);
      load();
    } catch (error) {
      message.error(errorMessage(error, "Yükleme başarısız."));
    } finally {
      setUploading(false);
    }
  };

  const onDelete = async (id: string) => {
    try {
      await axiosInstance.delete(`/admin/documents/${id}`);
      message.success("Doküman silindi.");
      load();
    } catch (error) {
      message.error(errorMessage(error, "Silme başarısız."));
    }
  };

  // Siralama sunucu tarafinda yapilir: liste ilk 100 kayitla sinirli oldugu icin
  // istemci tarafi siralama 100'un otesini sessizce yanlis gosterirdi.
  const onTableChange: TableProps<DocumentRecord>["onChange"] = (_pagination, _filters, sorter) => {
    const active = Array.isArray(sorter) ? sorter[0] : sorter;
    const field = active?.field as SortKey | undefined;
    if (!field || !active?.order) {
      setSort(DEFAULT_SORT);
      return;
    }
    setSort(active.order === "ascend" ? field : `-${field}`);
  };

  const sortOrder = (key: SortKey) => {
    if (sort === key) return "ascend" as const;
    if (sort === `-${key}`) return "descend" as const;
    return null;
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="middle">
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

      <Table<DocumentRecord>
        dataSource={documents}
        rowKey="id"
        loading={loading}
        pagination={false}
        size="small"
        onChange={onTableChange}
        locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Bu projeye henüz doküman yüklenmemiş." /> }}
      >
        <Table.Column<DocumentRecord>
          dataIndex="original_filename"
          title="Dosya"
          ellipsis
          sorter
          sortOrder={sortOrder("original_filename")}
        />
        <Table.Column<DocumentRecord> dataIndex="content_type" title="Tür" />
        <Table.Column<DocumentRecord>
          dataIndex="size_bytes"
          title="Boyut"
          render={formatSize}
          sorter
          sortOrder={sortOrder("size_bytes")}
        />
        <Table.Column<DocumentRecord>
          dataIndex="created_at"
          title="Yüklendi"
          render={fmtDateTime}
          sorter
          sortOrder={sortOrder("created_at")}
        />
        <Table.Column<DocumentRecord>
          title="İşlemler"
          render={(_, record) => (
            <Popconfirm
              cancelText="Vazgeç"
              okText="Sil"
              title="Bu doküman silinsin mi?"
              onConfirm={() => onDelete(record.id)}
            >
              <Button size="small" danger>
                Sil
              </Button>
            </Popconfirm>
          )}
        />
      </Table>
    </Space>
  );
}

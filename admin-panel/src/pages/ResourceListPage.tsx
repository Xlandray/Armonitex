import { useDelete } from "@refinedev/core";
import { List, useTable } from "@refinedev/antd";
import { Button, Popconfirm, Space, Table, Typography } from "antd";
import { useNavigate } from "react-router";

type ResourceRecord = { id: string; [key: string]: unknown };

type ResourceListPageProps = {
  resource: string;
  title: string;
  canCreate?: boolean;
  canDelete?: boolean;
};

export function ResourceListPage({
  resource,
  title,
  canCreate = true,
  canDelete = true,
}: ResourceListPageProps) {
  const navigate = useNavigate();
  const { tableProps } = useTable<ResourceRecord>({ resource });
  const { mutate: deleteRecord } = useDelete();
  const createButton = canCreate ? (
    <Button type="primary" onClick={() => navigate(`/${resource.split("/").at(-1)}/create`)}>
      Oluştur
    </Button>
  ) : null;

  return (
    <List title={title} headerButtons={createButton}>
      <Table<ResourceRecord> {...tableProps} rowKey="id">
        <Table.Column<ResourceRecord> dataIndex="id" title="ID" ellipsis />
        <Table.Column<ResourceRecord>
          title="Kayıt"
          render={(_, record) => (
            <Typography.Text code>{JSON.stringify(record, null, 2)}</Typography.Text>
          )}
        />
        <Table.Column<ResourceRecord>
          title="İşlemler"
          render={(_, record) => (
            <Space>
              <Button onClick={() => navigate(`/${resource.split("/").at(-1)}/edit/${record.id}`)}>
                Düzenle
              </Button>
              {canDelete ? (
                <Popconfirm
                  cancelText="Vazgeç"
                  okText="Sil"
                  title="Bu kayıt silinsin mi?"
                  onConfirm={() => deleteRecord({ resource, id: record.id })}
                >
                  <Button danger>Sil</Button>
                </Popconfirm>
              ) : null}
            </Space>
          )}
        />
      </Table>
    </List>
  );
}

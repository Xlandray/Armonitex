import { useDelete } from "@refinedev/core";
import { List, useTable } from "@refinedev/antd";
import { Button, Popconfirm, Space, Table } from "antd";
import { useNavigate } from "react-router";

import type { ResourceConfig } from "../resources";

type ResourceRecord = { id: string; [key: string]: unknown };

export function ResourceListPage({ config }: { config: ResourceConfig }) {
  const navigate = useNavigate();
  const { name: resource, path, label, columns, canCreate = true, canDelete = true } = config;
  const { tableProps } = useTable<ResourceRecord>({ resource });
  const { mutate: deleteRecord } = useDelete();

  const createButton = canCreate ? (
    <Button type="primary" onClick={() => navigate(`/${path}/create`)}>
      Oluştur
    </Button>
  ) : null;

  return (
    <List title={label} headerButtons={createButton}>
      <Table<ResourceRecord> {...tableProps} rowKey="id" scroll={{ x: true }}>
        {columns.map((col) => (
          <Table.Column<ResourceRecord>
            key={col.dataIndex}
            dataIndex={col.dataIndex}
            title={col.title}
            ellipsis={col.ellipsis}
            render={col.render ? (value, record) => col.render!(value, record) : undefined}
          />
        ))}
        <Table.Column<ResourceRecord>
          title="İşlemler"
          fixed="right"
          render={(_, record) => (
            <Space>
              <Button size="small" onClick={() => navigate(`/${path}/edit/${record.id}`)}>
                Düzenle
              </Button>
              {canDelete ? (
                <Popconfirm
                  cancelText="Vazgeç"
                  okText="Sil"
                  title="Bu kayıt silinsin mi?"
                  onConfirm={() => deleteRecord({ resource, id: record.id })}
                >
                  <Button size="small" danger>
                    Sil
                  </Button>
                </Popconfirm>
              ) : null}
            </Space>
          )}
        />
      </Table>
    </List>
  );
}

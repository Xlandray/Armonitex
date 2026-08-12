import { useDelete } from "@refinedev/core";
import { List, useTable } from "@refinedev/antd";
import { Button, Input, Popconfirm, Space, Table } from "antd";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";

import type { ResourceConfig } from "../resources";

type ResourceRecord = { id: string; [key: string]: unknown };

const SEARCH_DEBOUNCE_MS = 350;

export function ResourceListPage({ config }: { config: ResourceConfig }) {
  const navigate = useNavigate();
  const {
    name: resource,
    path,
    label,
    columns,
    canCreate = true,
    canDelete = true,
    searchable = false,
  } = config;
  const { tableProps, setFilters } = useTable<ResourceRecord>({ resource });
  const { mutate: deleteRecord } = useDelete();

  const [search, setSearch] = useState("");
  // setFilters kimligi degisirse efekt yeniden kosup sonsuz donguye girmesin
  // diye ref uzerinden okunuyor; efektin tek bagimliligi arama metni.
  const setFiltersRef = useRef(setFilters);
  useEffect(() => {
    setFiltersRef.current = setFilters;
  });

  // Kullanici arama kutusuna dokunmadan bos deger gonderip gereksiz bir
  // yeniden yukleme tetiklemeyelim.
  const searchTouched = useRef(false);
  useEffect(() => {
    if (!searchTouched.current) {
      if (search === "") return;
      searchTouched.current = true;
    }
    const timer = setTimeout(() => {
      setFiltersRef.current([{ field: "q", operator: "eq", value: search || undefined }], "merge");
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  const headerButtons = (
    <Space>
      {searchable ? (
        <Input.Search
          allowClear
          placeholder="Ara"
          style={{ width: 240 }}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      ) : null}
      {canCreate ? (
        <Button type="primary" onClick={() => navigate(`/${path}/create`)}>
          Oluştur
        </Button>
      ) : null}
    </Space>
  );

  return (
    <List title={label} headerButtons={headerButtons}>
      <Table<ResourceRecord> {...tableProps} rowKey="id" scroll={{ x: true }}>
        {columns.map((col) => (
          <Table.Column<ResourceRecord>
            key={col.dataIndex}
            dataIndex={col.dataIndex}
            title={col.title}
            ellipsis={col.ellipsis}
            sorter={col.sortable}
            filters={col.filter?.options.map((option) => ({
              text: option.label,
              value: option.value,
            }))}
            filterMultiple={false}
            render={
              col.render || col.linkTo
                ? (value, record) => {
                    const content = col.render ? col.render(value, record) : String(value ?? "");
                    return col.linkTo ? <Link to={col.linkTo(record)}>{content}</Link> : content;
                  }
                : undefined
            }
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

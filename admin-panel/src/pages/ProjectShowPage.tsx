import { useDelete, useOne } from "@refinedev/core";
import { useTable } from "@refinedev/antd";
import { Button, Card, Descriptions, Popconfirm, Result, Space, Spin, Table } from "antd";
import { Link, useNavigate, useParams } from "react-router";

import { ProjectDocuments } from "../components/ProjectDocuments";
import { customerLabel, dash, fmtDate, fmtDateTime, money, statusTag, typeTag } from "../display";

// Proje merkezli yonetim ekrani: projenin bilgisi, teklif/faturalari ve
// dokumanlari tek sayfada. Ek bir API ucu gerekmez; teklif/faturalar
// ?project_id= filtresiyle, dokumanlar zaten proje bazli uctan gelir.

type Customer = { id: string; email: string; full_name: string | null };

type Project = {
  id: string;
  title: string;
  description: string | null;
  reference_no: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  customer: Customer;
};

type FinancialRecord = { id: string; [key: string]: unknown };

export function ProjectShowPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const projectId = id ?? "";

  const { query } = useOne<Project>({
    resource: "admin/projects",
    id: projectId,
    queryOptions: { enabled: Boolean(projectId) },
  });
  const project = query.data?.data;

  const { tableProps } = useTable<FinancialRecord>({
    resource: "admin/financial-records",
    filters: { permanent: [{ field: "project_id", operator: "eq", value: projectId }] },
  });
  const { mutate: deleteRecord } = useDelete();

  if (query.isLoading) {
    return (
      <Space style={{ width: "100%", justifyContent: "center", padding: 48 }}>
        <Spin />
      </Space>
    );
  }

  if (!project) {
    return (
      <Result
        status="404"
        title="Proje bulunamadı."
        extra={
          <Button type="primary" onClick={() => navigate("/projects")}>
            Projelere dön
          </Button>
        }
      />
    );
  }

  return (
    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Card
        title={project.title}
        extra={
          <Space>
            <Button onClick={() => navigate("/projects")}>Projeler</Button>
            <Button type="primary" onClick={() => navigate(`/projects/edit/${project.id}`)}>
              Düzenle
            </Button>
          </Space>
        }
      >
        <Descriptions column={{ xs: 1, sm: 2 }} size="small" bordered>
          <Descriptions.Item label="Durum">{statusTag(project.status)}</Descriptions.Item>
          <Descriptions.Item label="Referans">{dash(project.reference_no)}</Descriptions.Item>
          <Descriptions.Item label="Müşteri">
            <Link to={`/users/edit/${project.customer.id}`}>{customerLabel(project.customer)}</Link>
          </Descriptions.Item>
          <Descriptions.Item label="Oluşturuldu">{fmtDateTime(project.created_at)}</Descriptions.Item>
          <Descriptions.Item label="Güncellendi">{fmtDateTime(project.updated_at)}</Descriptions.Item>
          <Descriptions.Item label="Açıklama" span={2}>
            {dash(project.description)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title="Teklif / Faturalar"
        extra={
          <Button
            type="primary"
            onClick={() => navigate(`/financial-records/create?project_id=${project.id}`)}
          >
            Ekle
          </Button>
        }
      >
        <Table<FinancialRecord> {...tableProps} rowKey="id" size="small" scroll={{ x: true }}>
          <Table.Column<FinancialRecord> dataIndex="type" title="Tür" render={typeTag} />
          <Table.Column<FinancialRecord> dataIndex="number" title="No" />
          <Table.Column<FinancialRecord>
            dataIndex="amount"
            title="Tutar"
            render={(value, record) => money(value, record.currency)}
          />
          <Table.Column<FinancialRecord> dataIndex="status" title="Durum" render={statusTag} />
          <Table.Column<FinancialRecord>
            dataIndex="issue_date"
            title="Düzenleme"
            render={fmtDate}
          />
          <Table.Column<FinancialRecord> dataIndex="due_date" title="Vade" render={fmtDate} />
          <Table.Column<FinancialRecord>
            title="İşlemler"
            fixed="right"
            render={(_, record) => (
              <Space>
                <Button
                  size="small"
                  onClick={() => navigate(`/financial-records/edit/${record.id}`)}
                >
                  Düzenle
                </Button>
                <Popconfirm
                  cancelText="Vazgeç"
                  okText="Sil"
                  title="Bu kayıt silinsin mi?"
                  onConfirm={() =>
                    deleteRecord({ resource: "admin/financial-records", id: record.id })
                  }
                >
                  <Button size="small" danger>
                    Sil
                  </Button>
                </Popconfirm>
              </Space>
            )}
          />
        </Table>
      </Card>

      <Card title="Dokümanlar">
        <ProjectDocuments projectId={project.id} />
      </Card>
    </Space>
  );
}

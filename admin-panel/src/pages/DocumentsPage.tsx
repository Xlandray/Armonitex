import { useEffect, useState } from "react";
import { Card, Empty, Select, Space, message } from "antd";

import { ProjectDocuments } from "../components/ProjectDocuments";
import { axiosInstance } from "../providers/axios";
import { errorMessage } from "../utils/errors";

// Proje secip dokumanlarini yoneten sekme. Yukleme/listeleme isini
// ProjectDocuments yapar; burada yalnizca proje secimi var. Ayni bilesen
// proje detay ekraninda da kullaniliyor.

type ProjectRecord = { id: string; title: string; reference_no: string | null };
type PageResponse<T> = { data: T[]; total: number };

export function DocumentsPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [projectId, setProjectId] = useState<string | undefined>();

  useEffect(() => {
    axiosInstance
      .get<PageResponse<ProjectRecord>>("/admin/projects", { params: { page_size: 100 } })
      .then((response) => setProjects(response.data.data))
      .catch((error) => message.error(errorMessage(error, "Projeler yüklenemedi.")));
  }, []);

  return (
    <Card title="Dokümanlar">
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <Select
          showSearch
          optionFilterProp="label"
          style={{ width: 420 }}
          placeholder="Proje seçin"
          value={projectId}
          onChange={setProjectId}
          options={projects.map((project) => ({
            value: project.id,
            label: project.reference_no
              ? `${project.title} (${project.reference_no})`
              : project.title,
          }))}
        />

        {projectId ? (
          <ProjectDocuments projectId={projectId} />
        ) : (
          <Empty description="Dokümanlarını görmek için bir proje seçin." />
        )}
      </Space>
    </Card>
  );
}

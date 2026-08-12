import { Authenticated, Refine } from "@refinedev/core";
import routerProvider, { CatchAllNavigate, NavigateToResource } from "@refinedev/react-router";
import { ErrorComponent, RefineThemes, ThemedLayout } from "@refinedev/antd";
import { App as AntdApp, ConfigProvider } from "antd";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";

import "@refinedev/antd/dist/reset.css";

import { LoginPage } from "./pages/LoginPage";
import { JsonResourceFormPage } from "./pages/JsonResourceFormPage";
import { ResourceListPage } from "./pages/ResourceListPage";
import { DocumentsPage } from "./pages/DocumentsPage";
import { authProvider } from "./providers/authProvider";
import { dataProvider } from "./providers/dataProvider";

const resources = [
  {
    name: "admin/contents",
    list: "/contents",
    create: "/contents/create",
    edit: "/contents/edit/:id",
    meta: { label: "İçerikler" },
  },
  {
    name: "admin/settings",
    list: "/settings",
    create: "/settings/create",
    edit: "/settings/edit/:id",
    meta: { label: "Ayarlar" },
  },
  {
    name: "admin/users",
    list: "/users",
    create: "/users/create",
    edit: "/users/edit/:id",
    meta: { label: "Kullanıcılar" },
  },
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
];

export default function App() {
  return (
    <BrowserRouter>
      <ConfigProvider theme={RefineThemes.Blue}>
        <AntdApp>
          <Refine
            authProvider={authProvider}
            dataProvider={{ default: dataProvider }}
            routerProvider={routerProvider}
            resources={resources}
          >
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                element={
                  <Authenticated key="admin-auth" fallback={<CatchAllNavigate to="/login" />}>
                    <ThemedLayout>
                      <Outlet />
                    </ThemedLayout>
                  </Authenticated>
                }
              >
                <Route index element={<NavigateToResource resource="admin/contents" />} />
                <Route
                  path="/contents"
                  element={<ResourceListPage resource="admin/contents" title="İçerikler" />}
                />
                <Route
                  path="/contents/create"
                  element={
                    <JsonResourceFormPage
                      resource="admin/contents"
                      title="İçerik oluştur"
                      mode="create"
                    />
                  }
                />
                <Route
                  path="/contents/edit/:id"
                  element={
                    <JsonResourceFormPage
                      resource="admin/contents"
                      title="İçerik düzenle"
                      mode="edit"
                    />
                  }
                />
                <Route
                  path="/settings"
                  element={<ResourceListPage resource="admin/settings" title="Ayarlar" />}
                />
                <Route
                  path="/settings/create"
                  element={
                    <JsonResourceFormPage
                      resource="admin/settings"
                      title="Ayar oluştur"
                      mode="create"
                    />
                  }
                />
                <Route
                  path="/settings/edit/:id"
                  element={
                    <JsonResourceFormPage
                      resource="admin/settings"
                      title="Ayar düzenle"
                      mode="edit"
                    />
                  }
                />
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
                <Route
                  path="/users/edit/:id"
                  element={
                    <JsonResourceFormPage
                      resource="admin/users"
                      title="Kullanıcı düzenle"
                      mode="edit"
                    />
                  }
                />
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
                    <ResourceListPage resource="admin/financial-records" title="Teklif/Fatura" />
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
                <Route path="*" element={<ErrorComponent />} />
              </Route>
              <Route path="*" element={<Navigate replace to="/login" />} />
            </Routes>
          </Refine>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
}

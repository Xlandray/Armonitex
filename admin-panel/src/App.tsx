import { Authenticated, Refine } from "@refinedev/core";
import routerProvider, { CatchAllNavigate, NavigateToResource } from "@refinedev/react-router";
import { ErrorComponent, RefineThemes, ThemedLayout } from "@refinedev/antd";
import { App as AntdApp, ConfigProvider } from "antd";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";

import "@refinedev/antd/dist/reset.css";

import { LoginPage } from "./pages/LoginPage";
import { JsonResourceFormPage } from "./pages/JsonResourceFormPage";
import { ResourceListPage } from "./pages/ResourceListPage";
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
    edit: "/users/edit/:id",
    meta: { label: "Kullanıcılar" },
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
                  element={
                    <ResourceListPage
                      resource="admin/users"
                      title="Kullanıcılar"
                      canCreate={false}
                      canDelete={false}
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

import { Fragment } from "react";
import { Authenticated, Refine } from "@refinedev/core";
import routerProvider, { CatchAllNavigate, NavigateToResource } from "@refinedev/react-router";
import { ErrorComponent, RefineThemes, ThemedLayout } from "@refinedev/antd";
import { App as AntdApp, ConfigProvider } from "antd";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";

import "@refinedev/antd/dist/reset.css";

import { LoginPage } from "./pages/LoginPage";
import { ResourceListPage } from "./pages/ResourceListPage";
import { ResourceFormPage } from "./pages/ResourceFormPage";
import { DocumentsPage } from "./pages/DocumentsPage";
import { RESOURCES } from "./resources";
import { authProvider } from "./providers/authProvider";
import { dataProvider } from "./providers/dataProvider";

const refineResources = [
  ...RESOURCES.map((r) => ({
    name: r.name,
    list: `/${r.path}`,
    create: `/${r.path}/create`,
    edit: `/${r.path}/edit/:id`,
    meta: { label: r.label },
  })),
  { name: "admin/documents", list: "/documents", meta: { label: "Dokümanlar" } },
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
            resources={refineResources}
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
                {RESOURCES.map((config) => (
                  <Fragment key={config.name}>
                    <Route
                      path={`/${config.path}`}
                      element={<ResourceListPage config={config} />}
                    />
                    <Route
                      path={`/${config.path}/create`}
                      element={<ResourceFormPage config={config} mode="create" />}
                    />
                    <Route
                      path={`/${config.path}/edit/:id`}
                      element={<ResourceFormPage config={config} mode="edit" />}
                    />
                  </Fragment>
                ))}
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

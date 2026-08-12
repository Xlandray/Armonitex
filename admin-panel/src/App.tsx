import { Fragment } from "react";
import { Authenticated, Refine } from "@refinedev/core";
import routerProvider, { CatchAllNavigate, NavigateToResource } from "@refinedev/react-router";
import {
  ErrorComponent,
  RefineThemes,
  ThemedLayout,
  useNotificationProvider,
} from "@refinedev/antd";
import { App as AntdApp, ConfigProvider } from "antd";
import trTR from "antd/locale/tr_TR";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";

import "@refinedev/antd/dist/reset.css";

import { LoginPage } from "./pages/LoginPage";
import { ResourceListPage } from "./pages/ResourceListPage";
import { ResourceFormPage } from "./pages/ResourceFormPage";
import { DocumentsPage } from "./pages/DocumentsPage";
import { ProjectShowPage } from "./pages/ProjectShowPage";
import { RESOURCES } from "./resources";
import { authProvider } from "./providers/authProvider";
import { dataProvider } from "./providers/dataProvider";

const refineResources = [
  ...RESOURCES.map((r) => ({
    name: r.name,
    list: `/${r.path}`,
    create: `/${r.path}/create`,
    edit: `/${r.path}/edit/:id`,
    ...(r.hasShow ? { show: `/${r.path}/show/:id` } : {}),
    meta: { label: r.label },
  })),
  { name: "admin/documents", list: "/documents", meta: { label: "Dokümanlar" } },
];

// useNotificationProvider antd'nin message context'ini kullanir, bu yuzden
// <AntdApp>'in altinda cagrilmak zorunda; App govdesinde cagrilirsa context
// disinda kalir ve hicbir bildirim gorunmez.
function AdminApp() {
  const notificationProvider = useNotificationProvider();

  return (
    <Refine
      authProvider={authProvider}
      dataProvider={{ default: dataProvider }}
      notificationProvider={notificationProvider}
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
              <Route path={`/${config.path}`} element={<ResourceListPage config={config} />} />
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
          {/* Proje detayi config'ten uretilemez (kendi duzeni ve alt tablolari
              var), bu yuzden rotasi burada elle tanimli. */}
          <Route path="/projects/show/:id" element={<ProjectShowPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="*" element={<ErrorComponent />} />
        </Route>
        <Route path="*" element={<Navigate replace to="/login" />} />
      </Routes>
    </Refine>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* antd'nin hazir metinleri varsayilan olarak Ingilizce gelir ("No data",
          sayfalama, tarih secici, filtre butonlari). Panelin geri kalani Turkce
          oldugu icin bu karisim, bos bir tabloyu bozuk gibi gosteriyordu. */}
      <ConfigProvider theme={RefineThemes.Blue} locale={trTR}>
        <AntdApp>
          <AdminApp />
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
}

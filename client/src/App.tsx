import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  ThemedLayoutV2,
  ThemedSiderV2,
  useNotificationProvider,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { App as AntdApp } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { authProvider } from "./authProvider";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import {
  BlogPostCreate,
  BlogPostEdit,
  BlogPostList,
  BlogPostShow,
} from "./pages/blog-posts";
import {
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
} from "./pages/categories";
import { ForgotPassword } from "./pages/forgotPassword";
import { ResetPassword } from "./pages/forgotPassword/reset";
import { Login } from "./pages/login";
import { Register } from "./pages/register";

import dataProvider from "refine-genezio";
import * as gsdk from "@genezio-sdk/refine";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <AntdApp>
            <Refine
              dataProvider={dataProvider(gsdk)}
              notificationProvider={useNotificationProvider}
              routerProvider={routerBindings}
              authProvider={authProvider}
              resources={[
                {
                  name: "blog_posts",
                  list: "/blog-posts",
                  create: "/blog-posts/create",
                  edit: "/blog-posts/edit/:id",
                  show: "/blog-posts/show/:id",
                  meta: {
                    canDelete: true,
                  },
                },
                {
                  name: "categories",
                  list: "/categories",
                  create: "/categories/create",
                  edit: "/categories/edit/:id",
                  show: "/categories/show/:id",
                  meta: {
                    canDelete: true,
                  },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                useNewQueryKeys: true,
                projectId: "GhP8hk-y7bDJH-6KX2Md",
              }}
            >
              <Routes>
                <Route
                  element={
                    <ThemedLayoutV2
                      Header={() => <Header sticky />}
                      Sider={(props) => <ThemedSiderV2 {...props} fixed />}
                    >
                      <Outlet />
                    </ThemedLayoutV2>
                  }
                >
                  <Route index element={<NavigateToResource resource="blog_posts" />} />
                  <Route path="/blog-posts">
                    <Route index element={<BlogPostList />} />
                    <Route path="show/:id" element={<BlogPostShow />} />
                    <Route
                      path="create"
                      element={
                        <Authenticated key="BlogPostCreate" fallback={<CatchAllNavigate to="/login" />}>
                          <BlogPostCreate />
                        </Authenticated>
                      }
                    />
                    <Route
                      path="edit/:id"
                      element={
                        <Authenticated key="BlogPostEdit" fallback={<CatchAllNavigate to="/login" />}>
                          <BlogPostEdit />
                        </Authenticated>
                      }
                    />
                  </Route>
                  <Route path="/categories">
                    <Route index element={<CategoryList />} />
                    <Route path="show/:id" element={<CategoryShow />} />
                    <Route
                      path="create"
                      element={
                        <Authenticated key="CategoryCreate" fallback={<CatchAllNavigate to="/login" />}>
                          <CategoryCreate />
                        </Authenticated>
                      }
                    />
                    <Route
                      path="edit/:id"
                      element={
                        <Authenticated key="CategoryEdit" fallback={<CatchAllNavigate to="/login" />}>
                          <CategoryEdit />
                        </Authenticated>
                      }
                    />
                  </Route>
                  <Route path="*" element={<ErrorComponent />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Routes>

              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </AntdApp>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;

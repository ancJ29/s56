import { LazyReactNode, WrapperComponentProps } from "@/common/types";
import { lazy } from "react";

export const wrapperMap: Record<
  string,
  LazyReactNode<
    WrapperComponentProps & {
      title?: string;
    }
  >
> = {
  Blank: lazy(() => import("@/common/ui-components/Wrappers/Blank")),
  Auth: lazy(() => import("@/common/ui-components/Wrappers/Auth")),
  CollapseAppShell: lazy(
    () => import("@/common/ui-components/AppShell/Collapse"),
  ),
};

const routes = [
  {
    path: "/login",
    title: "Login",
    element: lazy(() => import("@/pages/login")),
  },
  {
    path: "/clients",
    wrappers: ["Auth", "CollapseAppShell"],
    title: "Client Management",
    element: lazy(() => import("@/pages/clients")),
  },
  {
    path: "/task-management",
    title: "Task Management",
    wrappers: ["Auth", "CollapseAppShell"],
    element: lazy(() => import("@/pages/tasks")),
  },
  {
    path: "/user-management",
    title: "User Management",
    wrappers: ["Auth", "CollapseAppShell"],
    element: lazy(() => import("@/pages/users")),
  },
  {
    path: "/logout",
    element: lazy(() => import("@/pages/logout")),
  },
  {
    path: "/dashboard",
    title: "Dashboard",
    wrappers: ["Auth", "CollapseAppShell"],
    element: lazy(() => import("@/pages/tasks")),
  },
  {
    path: "/profile",
    title: "Profile",
    wrappers: ["Auth", "CollapseAppShell"],
    element: lazy(() => import("@/pages/profile")),
  },
  {
    path: "*",
    wrapper: "Blank",
    element: lazy(() => import("@/pages/login")),
  },
].map(({ title, path, wrapper, wrappers, element: Component }) => {
  return {
    path,
    element: (wrappers?.length ? wrappers : [wrapper || "Blank"])
      .map((wrapper) => {
        return wrapperMap[wrapper || "Blank"] || wrapperMap["Blank"];
      })
      .reduce(
        (children, Wrapper) => {
          return <Wrapper title={title}>{children}</Wrapper>;
        },
        <Component />,
      ),
  };
});

export default routes;

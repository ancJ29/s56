import { LazyReactNode } from "@/common/types";
import { lazy } from "react";

export const wrapperMap: Record<string, LazyReactNode> = {
  Blank: lazy(() => import("@/common/ui-components/Wrappers/Blank")),
  Auth: lazy(() => import("@/common/ui-components/Wrappers/Auth")),
  CollapseAppShell: lazy(
    () => import("@/common/ui-components/AppShell/Collapse"),
  ),
};

const routes = [
  {
    path: "/login",
    element: lazy(() => import("@/pages/login")),
  },
  // {
  //   path: "/clients",
  //   wrappers: ["Auth", "CollapseAppShell"],
  //   element: lazy(() => import("@/pages/clients")),
  // },
  {
    path: "/tasks",
    wrappers: ["Auth", "CollapseAppShell"],
    element: lazy(() => import("@/pages/tasks")),
  },
  {
    path: "/logout",
    element: lazy(() => import("@/pages/logout")),
  },
  // {
  //   path: "/dashboard",
  //   wrappers: ["Auth", "CollapseAppShell"],
  //   element: lazy(() => import("@/pages/dashboard")),
  // },
  {
    path: "*",
    wrapper: "Blank",
    element: lazy(() => import("@/pages/tasks")),
  },
].map(({ path, wrapper, wrappers, element: Component }) => {
  return {
    path,
    element: (wrappers?.length ? wrappers : [wrapper || "Blank"])
      .map((wrapper) => {
        return wrapperMap[wrapper || "Blank"] || wrapperMap["Blank"];
      })
      .reduce(
        (children, Wrapper) => {
          return <Wrapper>{children}</Wrapper>;
        },
        <Component />,
      ),
  };
});

export default routes;

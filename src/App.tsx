import { getMetaData } from "@/common/services/client";
import useAppStore from "@/common/stores/app";
import useAuthStore from "@/common/stores/auth";
import clientStore from "@/common/stores/client";
import routes from "@/routes";
import { resolver, theme } from "@/styles/theme/mantine-theme";
import { ModalsProvider } from "@mantine/modals";

import { LoadingOverlay, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { useRoutes } from "react-router-dom";

function App() {
  const { payload } = useAuthStore();
  const { loading } = useAppStore();
  useEffect(() => {
    if (!payload?.id) {
      return;
    }
    getMetaData().then((data) => {
      if (data) {
        clientStore.getState().updateClient(data);
      }
    });
  }, [payload?.id]);

  return (
    <MantineProvider
      theme={theme}
      cssVariablesResolver={resolver}
      defaultColorScheme="light"
    >
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 10 }}
      />
      <ModalsProvider>{useRoutes(routes)}</ModalsProvider>
      <Notifications />
    </MantineProvider>
  );
}

export default App;

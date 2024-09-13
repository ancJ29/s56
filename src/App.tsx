import { getMetaData } from "@/common/services/client";
import useAuthStore from "@/common/stores/auth";
import clientStore from "@/common/stores/client";
import routes from "@/routes";
import { resolver, theme } from "@/styles/theme/mantine-theme";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { useEffect } from "react";
import { useRoutes } from "react-router-dom";

function App() {
  const { payload } = useAuthStore();
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
      {useRoutes(routes)}
      <Notifications />
    </MantineProvider>
  );
}

export default App;

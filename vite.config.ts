import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import preload from "vite-plugin-preload";

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return defineConfig({
    server: {
      port: 9950,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    plugins: [react(), preload()],
    define: {
      "import.meta.env.APP_CLIENT_ID": Number(env.APP_CLIENT_ID),
      "import.meta.env.APP_API_URL": JSON.stringify(env.APP_API_URL),
    },
  });
}

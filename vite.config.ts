import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import preload from "vite-plugin-preload";

export default () => {
  return defineConfig({
    plugins: [react(), preload()],
    server: {
      port: 9950,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    envPrefix: "APP_",
  });
};

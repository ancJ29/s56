import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import preload from "vite-plugin-preload";
import { VitePWA } from "vite-plugin-pwa";

export default () => {
  return defineConfig({
    plugins: [react(), preload(), VitePWA({
      manifest: {
        theme_color: "#000000",
      },
    })],
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

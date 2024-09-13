import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import preload from "vite-plugin-preload";

// https://vitejs.dev/config/
export default () => {
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
  });
}

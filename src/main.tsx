import { LanguageProvider } from "@/common/contexts/LanguageContext";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <React.Suspense>
      <BrowserRouter>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </BrowserRouter>
    </React.Suspense>,
  );
}

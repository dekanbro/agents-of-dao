import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { HausThemeProvider } from "@daohaus/ui";
import { QueryClient, QueryClientProvider } from "react-query";
import App from "./App.tsx";
import "./index.css";
import { defaultTheme } from "./theme/default.ts";


const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <HausThemeProvider themeOverrides={defaultTheme} >
          <App />
        </HausThemeProvider>
      </QueryClientProvider>
    </HashRouter>
  </React.StrictMode>
);

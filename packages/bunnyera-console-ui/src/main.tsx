import React from "react";
import ReactDOM from "react-dom/client";
import { ConsoleLayout } from "./layout/ConsoleLayout";
import { RouteProvider } from "./router";
import "./styles/tailwind.css";

const root = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <RouteProvider>
      <ConsoleLayout />
    </RouteProvider>
  </React.StrictMode>
);

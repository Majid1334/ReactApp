import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { registerLicense } from "@syncfusion/ej2-base";

const license = (import.meta as any).env?.VITE_Syncfusion_Licence ?? "";
registerLicense(license);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

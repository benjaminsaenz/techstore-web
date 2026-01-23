import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// ✅ Seed: crea un usuario demo para login rápido en presentaciones
import { seedDemoUserIfMissing } from "./utils/auth.js";

/* Bootstrap */
import "bootstrap/dist/css/bootstrap.min.css";

/* Tus estilos globales */
import "./index.css";

/* Bootstrap JS (dropdown/collapse/carrusel) */
import "bootstrap/dist/js/bootstrap.bundle.min.js";

seedDemoUserIfMissing();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


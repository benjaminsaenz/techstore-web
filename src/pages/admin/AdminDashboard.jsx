import { Navigate, Routes, Route } from "react-router-dom";
import { useRef } from "react";
import AdminSidebar from "./AdminSidebar.jsx";
import AdminClientes from "./AdminClientes.jsx";
import AdminProductos from "./AdminProductos.jsx";
import AdminVentas from "./AdminVentas.jsx";
import { seedIfEmpty } from "./adminStore.js";
import { isAdmin as isAdminSession } from "../AdminLogin.jsx";

export default function AdminDashboard() {
  if (!isAdminSession()) return <Navigate to="/admin-login" replace />;

  // ✅ SEED SIN useEffect: se ejecuta ANTES de que monten Clientes/Productos
  const seeded = useRef(false);
  if (!seeded.current) {
    seedIfEmpty();
    seeded.current = true;
  }

  return (
    <div className="d-flex">
      <AdminSidebar />

      <div className="flex-grow-1">
        <div className="p-3 border-bottom bg-light ts-dark">
          <h4 className="m-0">Panel Administrador</h4>
        </div>

        <div className="p-4">
          <Routes>
            <Route path="/" element={<Navigate to="clientes" replace />} />
            <Route path="clientes" element={<AdminClientes />} />
            <Route path="productos" element={<AdminProductos />} />
            <Route path="ventas" element={<AdminVentas />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}


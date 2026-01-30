import { NavLink, useNavigate } from "react-router-dom";

const ADMIN_KEY = "techstore_is_admin_v1";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    "list-group-item list-group-item-action " + (isActive ? "active" : "");

  const logout = () => {
    localStorage.removeItem(ADMIN_KEY);
    navigate("/admin-login");
  };

  return (
    <div className="border-end" style={{ width: 280, minHeight: "100vh" }}>
      <div className="p-3 border-bottom">
        <div className="fw-bold">TechStore Admin</div>
        
      </div>

      <div className="list-group list-group-flush">
        <NavLink to="/admin/clientes" className={linkClass}>
          Gestión de Clientes
        </NavLink>
        <NavLink to="/admin/productos" className={linkClass}>
          Gestión de Productos
        </NavLink>
        <NavLink to="/admin/ventas" className={linkClass}>
          Gestión de Ventas
        </NavLink>
      </div>

      <div className="p-3">
        <button className="btn btn-outline-danger w-100" onClick={logout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}

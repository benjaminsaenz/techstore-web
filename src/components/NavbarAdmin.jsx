import { Link, useNavigate } from "react-router-dom";
import { logoutAdmin } from "../pages/AdminLogin.jsx";

export default function NavbarAdmin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container-fluid">
        <span className="navbar-brand">Panel Administrador - TechStore</span>
        <div className="d-flex gap-2">
          <Link to="/" className="btn btn-outline-light btn-sm">
            Ir a la tienda
          </Link>
          <button onClick={handleLogout} className="btn btn-outline-warning btn-sm" type="button">
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  );
}

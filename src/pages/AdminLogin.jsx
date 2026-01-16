import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarMain from "../components/NavbarMain.jsx";

const ADMIN_KEY = "techstore_is_admin_v1";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState({});
  const [finalMsg, setFinalMsg] = useState("");

  const validarAdmin = (e) => {
    e.preventDefault();

    const errors = {};
    const c = correo.trim();
    const p = password.trim();

    if (!c) errors.correo = "El correo es obligatorio";
    if (!p) errors.password = "La contraseña es obligatoria";

    setErr(errors);
    setFinalMsg("");

    if (Object.keys(errors).length > 0) return;

    const correoAdmin = "admin@techstore.cl";
    const passAdmin = "admin123";

    if (c === correoAdmin && p === passAdmin) {
      localStorage.setItem(ADMIN_KEY, "1");
      setFinalMsg("Acceso administrador exitoso ✔");
      setTimeout(() => navigate("/admin"), 600);
    } else {
      localStorage.removeItem(ADMIN_KEY);
      setFinalMsg("Credenciales incorrectas");
    }
  };

  return (
    <>
      <NavbarMain />

      <section className="hero-registro d-flex align-items-center">
        <main className="container my-5">
          <h2 className="text-center text-white mb-4">Acceso Administrador</h2>

          <form onSubmit={validarAdmin} noValidate>
            <div className="mb-3">
              <label className="text-white">Correo administrador</label>
              <input
                type="email"
                className="form-control"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
              <small className="text-danger">{err.correo || ""}</small>
            </div>

            <div className="mb-3">
              <label className="text-white">Contraseña</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <small className="text-danger">{err.password || ""}</small>
            </div>

            <button type="submit" className="btn btn-danger w-100">
              Ingresar
            </button>

            {finalMsg && (
              <p
                className={`mt-3 fw-bold text-center ${
                  finalMsg.includes("✔") ? "text-success" : "text-danger"
                }`}
              >
                {finalMsg}
              </p>
            )}

            <p className="text-white small mt-3 mb-0">Credenciales demo:</p>
            <p className="text-white small mb-0">admin@techstore.cl / admin123</p>
          </form>
        </main>
      </section>
    </>
  );
}

export function isAdmin() {
  return localStorage.getItem(ADMIN_KEY) === "1";
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_KEY);
}

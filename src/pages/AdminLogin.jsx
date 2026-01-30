import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarMain from "../components/NavbarMain.jsx";

import { apiFetch, clearAuthSession, setAuthSession } from "../api/http";

const ADMIN_KEY = "techstore_is_admin_v1"; // legacy flag (kept for backwards-compat)

export default function AdminLogin() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState({});
  const [finalMsg, setFinalMsg] = useState("");

  const validarAdmin = async (e) => {
    e.preventDefault();

    const errors = {};
    const c = correo.trim();
    const p = password.trim();

    if (!c) errors.correo = "El correo es obligatorio";
    if (!p) errors.password = "La contraseña es obligatoria";

    setErr(errors);
    setFinalMsg("");

    if (Object.keys(errors).length > 0) return;

    try {
      // Backend login
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { email: c, password: p },

      });

      // Persist JWT for admin API calls
      setAuthSession({ token: data.token, role: data.role });
      // legacy flag so old checks don't break
      if (String(data.role).toUpperCase() === "ADMIN") {
        localStorage.setItem(ADMIN_KEY, "1");
      } else {
        localStorage.removeItem(ADMIN_KEY);
      }

      setFinalMsg("Acceso exitoso ✔");
      setTimeout(() => navigate("/admin"), 400);
    } catch (err) {
      clearAuthSession();
      localStorage.removeItem(ADMIN_KEY);
      setFinalMsg(err?.message || "Credenciales incorrectas");
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
  // Prefer backend auth (JWT)
  const role = localStorage.getItem("techstore_role") || "";
  if (role.toUpperCase() === "ADMIN") return true;
  // Fallback to legacy flag
  return localStorage.getItem(ADMIN_KEY) === "1";
}

export function logoutAdmin() {
  localStorage.removeItem(ADMIN_KEY);
  clearAuthSession();
}

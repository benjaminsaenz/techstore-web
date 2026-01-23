import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import NavbarMain from "../components/NavbarMain.jsx";
import { DEMO_CREDENTIALS, login } from "../utils/auth.js";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirect = params.get("redirect") || "/";

  // ✅ Pre-relleno (demo) para no perder tiempo durante presentación
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password);
  const [msg, setMsg] = useState("");

  const fillDemo = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setMsg("");
    const res = login(email, password);
    if (!res.ok) return setMsg(res.error);
    navigate(redirect, { replace: true });
  };

  return (
    <>
      <NavbarMain />

      <section className="hero-registro d-flex align-items-center">
        <main className="container my-5" style={{ maxWidth: 420 }}>
          <h2 className="mb-4 text-center text-white">Iniciar sesión</h2>

          <form onSubmit={onSubmit} noValidate>
            <div className="mb-3">
              <label className="text-white">Correo electrónico</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="text-white">Contraseña</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-primary w-100" type="submit">
              Ingresar
            </button>

            <div className="alert alert-info mt-3 mb-0">
              <div className="fw-bold">Usuario demo (presentación)</div>
              <div className="small">
                <div>
                  <span className="fw-bold">Correo:</span> {DEMO_CREDENTIALS.email}
                </div>
                <div>
                  <span className="fw-bold">Clave:</span> {DEMO_CREDENTIALS.password}
                </div>
              </div>

            </div>

            {msg && <div className="alert alert-danger mt-3">{msg}</div>}
          </form>

          <hr className="text-white" />

          <p className="text-center text-white">
            ¿No tienes cuenta?{" "}
            <Link to={`/registro?redirect=${encodeURIComponent(redirect)}`} className="text-warning">
              Crear cuenta
            </Link>
          </p>

          <p className="text-muted small text-center">Acceso demostrativo</p>

          <Link to="/admin-login" className="btn btn-outline-danger w-100">
            Ingresar como Administrador
          </Link>
        </main>
      </section>
    </>
  );
}

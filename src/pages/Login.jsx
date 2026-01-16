import { Link } from "react-router-dom";
import NavbarMain from "../components/NavbarMain.jsx";


export default function Login() {
  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <NavbarMain />

      <section className="hero-registro d-flex align-items-center">
        <main className="container my-5" style={{ maxWidth: 400 }}>
          <h2 className="mb-4 text-center text-white">Iniciar sesión</h2>

          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="text-white">Correo electrónico</label>
              <input type="email" className="form-control" />
            </div>

            <div className="mb-3">
              <label className="text-white">Contraseña</label>
              <input type="password" className="form-control" />
            </div>

            <button className="btn btn-primary w-100" type="submit">
              Ingresar
            </button>
          </form>

          <hr className="text-white" />

          <p className="text-center text-white">
            ¿No tienes cuenta?{" "}
            <Link to="/registro" className="text-warning">
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

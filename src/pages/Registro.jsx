import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NavbarMain from "../components/NavbarMain.jsx";
import { validarRutFormato, validarRutModulo11 } from "../utils/rut.js";
import { registerUser } from "../utils/auth.js";

export default function Registro() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirect = params.get("redirect") || "/";

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    password: "",
    rut: "",
    telefono: "",
    ciudad: "",
    region: "",
    comuna: "",
    direccion: "",
  });
  const [err, setErr] = useState({});
  const [msgFinal, setMsgFinal] = useState("");

  const setField = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const validarFormulario = (e) => {
    e.preventDefault();

    const errors = {};
    const nombre = form.nombre.trim();
    const correo = form.correo.trim();
    const password = form.password.trim();
    const rut = form.rut.trim();
    const telefono = form.telefono.trim();
    const ciudad = form.ciudad;
    const direccion = form.direccion.trim();

    if (nombre.length < 3) errors.nombre = "Nombre muy corto";
    if (!correo) errors.correo = "El correo es obligatorio";
    if (password.length < 6) errors.password = "Mínimo 6 caracteres";

    if (!validarRutFormato(rut)) {
      errors.rut = "Formato de RUT inválido";
    } else if (!validarRutModulo11(rut)) {
      errors.rut = "RUT inválido";
    }

    if (!telefono || Number.isNaN(Number(telefono))) errors.telefono = "Teléfono inválido";

    if (!["Santiago", "Valparaíso", "Concepción"].includes(ciudad)) errors.ciudad = "Seleccione una ciudad";

    if (!direccion) errors.direccion = "La dirección es obligatoria";

    setErr(errors);

    if (Object.keys(errors).length > 0) {
      setMsgFinal("");
      return;
    }

    const result = registerUser({
      name: nombre,
      email: correo,
      password,
      rut,
      phone: telefono,
      city: form.ciudad,
      region: form.region,
      comuna: form.comuna,
      address: direccion,
    });

    if (!result.ok) {
      setMsgFinal("");
      return alert(result.error);
    }

    setMsgFinal("Registro completado correctamente ✔");

    // Si venías del checkout, vuelve ahí automáticamente
    setTimeout(() => {
      navigate(redirect, { replace: true });
    }, 400);
  };

  return (
    <>
      <NavbarMain />

      <section className="hero-registro d-flex align-items-center">
        <main className="container my-5">
          <h2 className="mb-4 text-center text-white">Crear cuenta</h2>

          <form onSubmit={validarFormulario} noValidate>
            <div className="mb-3">
              <label className="text-white">Nombre</label>
              <input type="text" className="form-control" value={form.nombre} onChange={setField("nombre")} />
              <small className="text-danger">{err.nombre || ""}</small>
            </div>

            <div className="mb-3">
              <label className="text-white">Correo electrónico</label>
              <input type="email" className="form-control" value={form.correo} onChange={setField("correo")} />
              <small className="text-danger">{err.correo || ""}</small>
            </div>

            <div className="mb-3">
              <label className="text-white">Contraseña</label>
              <input type="password" className="form-control" value={form.password} onChange={setField("password")} />
              <small className="text-danger">{err.password || ""}</small>
            </div>

            <div className="mb-3">
              <label className="text-white" htmlFor="rut">
                RUT
              </label>
              <input
                type="text"
                id="rut"
                className="form-control"
                placeholder="12.345.678-9"
                maxLength={12}
                value={form.rut}
                onChange={setField("rut")}
                required
              />
              <small className="text-muted">Ej: 12.345.678-9</small>
              <br />
              <small className="text-danger">{err.rut || ""}</small>
            </div>

            <div className="mb-3">
              <label className="text-white">Teléfono</label>
              <input type="text" className="form-control" value={form.telefono} onChange={setField("telefono")} />
              <small className="text-danger">{err.telefono || ""}</small>
            </div>

            <div className="mb-3">
              <label className="text-white">Ciudad</label>
              <select className="form-select" value={form.ciudad} onChange={setField("ciudad")}>
                <option value="">Seleccione</option>
                <option value="Santiago">Santiago</option>
                <option value="Valparaíso">Valparaíso</option>
                <option value="Concepción">Concepción</option>
              </select>
              <small className="text-danger">{err.ciudad || ""}</small>
            </div>

            <div className="mb-3">
              <label className="text-white">Región</label>
              <select className="form-select" value={form.region} onChange={setField("region")}>
                <option value="">Seleccione región</option>
                <option value="RM">Región Metropolitana</option>
                <option value="V">Valparaíso</option>
                <option value="VIII">Biobío</option>
                <option value="IX">La Araucanía</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="text-white">Comuna</label>
              <select className="form-select" value={form.comuna} onChange={setField("comuna")}>
                <option value="">Seleccione comuna</option>
                <option value="Santiago">Santiago</option>
                <option value="Providencia">Providencia</option>
                <option value="Maipú">Maipú</option>
                <option value="Puente Alto">Puente Alto</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="text-white">Dirección</label>
              <input type="text" className="form-control" value={form.direccion} onChange={setField("direccion")} />
              <small className="text-danger">{err.direccion || ""}</small>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Registrarse
            </button>

            <div className="text-center mt-3">
              <span className="text-white-50">¿Ya tienes cuenta? </span>
              <Link to="/login" className="link-light fw-semibold">
                Inicia sesión
              </Link>
            </div>

            <p className={`mt-3 fw-bold text-center ${msgFinal ? "text-success" : ""}`}>{msgFinal}</p>
          </form>
        </main>
      </section>
    </>
  );
}

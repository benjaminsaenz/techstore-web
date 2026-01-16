import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  const goTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-dark text-light mt-5">
      {/* Bloque superior */}
      <div className="container py-5">
        <div className="row g-4">
          {/* Marca */}
          <div className="col-12 col-md-4">
            <h5 className="fw-bold mb-3">TechStore</h5>
            <p className="text-secondary mb-3">
              Accesorios tecnológicos para potenciar tu setup. Productos gamer,
              oficina y hogar con envío rápido.
            </p>

            <div className="d-flex gap-2 flex-wrap">
              <span className="badge text-bg-secondary">Envíos</span>
              <span className="badge text-bg-secondary">Garantía</span>
              <span className="badge text-bg-secondary">Soporte</span>
              <span className="badge text-bg-secondary">Pagos seguros</span>
            </div>
          </div>

          {/* Links */}
          <div className="col-6 col-md-2">
            <h6 className="fw-bold mb-3">Navegación</h6>
            <ul className="list-unstyled d-grid gap-2">
              <li>
                <Link className="link-light text-decoration-none" to="/">
                  Inicio
                </Link>
              </li>
              <li>
                <Link className="link-light text-decoration-none" to="/productos">
                  Productos
                </Link>
              </li>
              <li>
                <Link className="link-light text-decoration-none" to="/nosotros">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link className="link-light text-decoration-none" to="/contacto">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Ayuda */}
          <div className="col-6 col-md-3">
            <h6 className="fw-bold mb-3">Ayuda</h6>
            <ul className="list-unstyled d-grid gap-2">
              <li>
                <a className="link-light text-decoration-none" href="#">
                  Términos y condiciones
                </a>
              </li>
              <li>
                <a className="link-light text-decoration-none" href="#">
                  Políticas de privacidad
                </a>
              </li>
              <li>
                <a className="link-light text-decoration-none" href="#">
                  Cambios y devoluciones
                </a>
              </li>
              <li>
                <a className="link-light text-decoration-none" href="#">
                  Preguntas frecuentes
                </a>
              </li>
            </ul>
          </div>

          {/* Contacto + Suscripción */}
          <div className="col-12 col-md-3">
            <h6 className="fw-bold mb-3">Contacto</h6>
            <div className="text-secondary small mb-2">
              <div>📍 Santiago, Chile</div>
              <div>📧 soporte@techstore.cl</div>
              <div>📞 +56 9 1234 5678</div>
              <div className="mt-2">🕒 Lun–Vie 09:00–18:00</div>
            </div>

            <h6 className="fw-bold mt-4 mb-2">Recibe ofertas</h6>
            <form
              className="d-flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                alert("¡Gracias! Te enviaremos novedades.");
              }}
            >
              <input
                type="email"
                className="form-control"
                placeholder="tu@email.com"
                required
              />
              <button className="btn btn-primary" type="submit">
                Enviar
              </button>
            </form>

            <div className="d-flex gap-3 mt-3">
              <a className="link-light text-decoration-none" href="#" aria-label="Instagram">
                Instagram
              </a>
              <a className="link-light text-decoration-none" href="#" aria-label="Facebook">
                Facebook
              </a>
              <a className="link-light text-decoration-none" href="#" aria-label="TikTok">
                TikTok
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="border-top border-secondary">
        <div className="container py-3 d-flex flex-column flex-md-row gap-2 align-items-center">
          <div className="text-secondary small">
            © {year} TechStore. Todos los derechos reservados.
          </div>

          <div className="ms-md-auto d-flex gap-2">
            <span className="text-secondary small">Pagos:</span>
            <span className="badge text-bg-secondary">WebPay</span>
            <span className="badge text-bg-secondary">Transferencia</span>
            <span className="badge text-bg-secondary">Débito/Crédito</span>
          </div>

          <button
            className="btn btn-outline-light btn-sm ms-md-3"
            onClick={goTop}
            type="button"
          >
            ↑ Ir arriba
          </button>
        </div>
      </div>
    </footer>
  );
}

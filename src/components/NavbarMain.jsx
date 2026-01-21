import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { cartCount } from "../utils/cart.js";
import { getCurrentUser, logout } from "../utils/auth.js";

export default function NavbarMain() {
  const location = useLocation();
  const [count, setCount] = useState(0);
  const [user, setUser] = useState(() => getCurrentUser());

  useEffect(() => {
    // update on route change
    setCount(cartCount());
  }, [location]);

  useEffect(() => {
    const onCart = () => setCount(cartCount());
    const onAuth = () => setUser(getCurrentUser());
    window.addEventListener("techstore:cart", onCart);
    window.addEventListener("storage", onCart);
    window.addEventListener("techstore:auth", onAuth);
    return () => {
      window.removeEventListener("techstore:cart", onCart);
      window.removeEventListener("storage", onCart);
      window.removeEventListener("techstore:auth", onAuth);
    };
  }, []);

  const onBuscar = (e) => {
    e.preventDefault();
  };

  return (
    <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          TechStore
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarColor01"
          aria-controls="navbarColor01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarColor01">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/nosotros">
                Nosotros
              </Link>
            </li>

            <form className="d-flex" onSubmit={onBuscar}>
              <input
                className="form-control me-sm-2"
                type="search"
                placeholder="BUSCAR"
              />
              <button className="btn btn-secondary" type="submit">
                Buscar
              </button>
            </form>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                href="#"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
                onClick={(e) => e.preventDefault()}
              >
                Menu
              </a>

              <div className="dropdown-menu">
                <Link className="dropdown-item" to="/productos">
                  Productos
                </Link>
                <Link className="dropdown-item" to="/categorias">
                  Categorías
                </Link>
                <Link className="dropdown-item" to="/ofertas">
                  Ofertas
                </Link>
                <div className="dropdown-divider" />
                <Link className="dropdown-item" to="/contacto">
                  Contacto
                </Link>
                {user ? (
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => logout()}
                  >
                    Cerrar sesión
                  </button>
                ) : (
                  <Link className="dropdown-item" to="/login">
                    Inicio Sesión
                  </Link>
                )}
              </div>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            {/* Usuario (estado de sesión visible) */}
            <div className="dropdown">
              <a
                className="nav-link dropdown-toggle text-white"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={(e) => e.preventDefault()}
              >
                <i className="fa-solid fa-user me-2" />
                {user ? (
                  <span className="fw-semibold">Mi cuenta</span>
                ) : (
                  <span>Cuenta</span>
                )}
              </a>

              <div className="dropdown-menu dropdown-menu-end">
                {user ? (
                  <>
                    <div className="dropdown-item-text">
                      <div className="small text-muted">Sesión iniciada</div>
                      <div className="fw-semibold">{user.name}</div>
                      <div className="small text-muted">{user.email}</div>
                    </div>
                    <div className="dropdown-divider" />
                    <button type="button" className="dropdown-item" onClick={() => logout()}>
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link className="dropdown-item" to="/login">
                      Iniciar sesión
                    </Link>
                    <Link className="dropdown-item" to="/registro">
                      Crear cuenta
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Carrito */}
            <Link className="nav-link text-white fs-3 position-relative" to="/carrito" aria-label="Carrito">
              <i className="fa-solid fa-basket-shopping" />
              {count > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: 12 }}
                >
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

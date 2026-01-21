import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import NavbarMain from "../components/NavbarMain.jsx";
import { PRODUCTS } from "../utils/products.js";
import { addToCart, formatCLP } from "../utils/cart.js";
import { getCurrentUser } from "../utils/auth.js";

export default function ProductoMouse() {
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);
  const user = getCurrentUser();

  const product = useMemo(() => PRODUCTS.find((p) => p.id === "mouse1"), []);

  useEffect(() => {
    // si por alguna razón no existe, volvemos a productos
    if (!product) navigate("/productos", { replace: true });
  }, [product, navigate]);

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    // Si NO hay sesión, primero registro y luego vuelve a /checkout
    if (!user) {
      navigate("/registro?redirect=/checkout");
      return;
    }
    // Con sesión, directo a checkout
    navigate("/checkout");
  };

  return (
    <>
      <NavbarMain />

      {/* Hero */}
      <section className="hero-productos text-white d-flex align-items-center">
        <div className="container text-center">
          <h1 className="fw-bold">{product.name}</h1>
          <p className="mb-0">Detalle del producto • Envío rápido • Garantía</p>
        </div>
      </section>

      <main className="container my-5">
        <div className="row g-4 align-items-start">
          {/* Imagen */}
          <div className="col-lg-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="badge bg-success">Stock disponible</span>
                  <span className="small text-muted">SKU: {product.id.toUpperCase()}</span>
                </div>

                <img
                  src={product.img}
                  alt={product.name}
                  className="img-fluid rounded"
                  style={{ width: "100%", maxHeight: 430, objectFit: "cover" }}
                />

                <div className="d-flex gap-2 mt-3 flex-wrap">
                  <span className="badge bg-primary">RGB</span>
                  <span className="badge bg-primary">Inalámbrico</span>
                  <span className="badge bg-primary">Gaming</span>
                  <span className="badge bg-secondary">12.000 DPI</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="col-lg-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <h2 className="h4 fw-bold m-0">{product.name}</h2>
                  <div className="text-warning" aria-label="rating">
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-solid fa-star" />
                    <i className="fa-regular fa-star" />
                    <span className="text-muted ms-2 small">(4.0)</span>
                  </div>
                </div>

                <p className="text-muted mt-2">
                  Mouse pensado para rendimiento gaming: respuesta rápida, buena ergonomía y un look moderno con
                  iluminación.
                </p>

                <div className="d-flex align-items-end gap-3 mt-3">
                  <div>
                    <div className="small text-muted">Precio</div>
                    <div className="fs-3 fw-bold">{formatCLP(product.price)}</div>
                  </div>
                  <div className="small text-muted mb-2">IVA incluido</div>
                </div>

                <hr />

                <h3 className="h6 fw-bold">Características principales</h3>
                <ul className="list-unstyled mb-4">
                  {product.features.map((f) => (
                    <li key={f} className="mb-1">
                      ✅ {f}
                    </li>
                  ))}
                  <li className="mb-1">✅ Garantía 6 meses</li>
                  <li className="mb-1">✅ Soporte post-venta</li>
                </ul>

                <div className="d-flex gap-2 flex-wrap">
                  <button type="button" className="btn btn-success btn-lg" onClick={handleBuyNow}>
                    Comprar ahora
                  </button>

                  <button type="button" className="btn btn-primary btn-lg" onClick={handleAdd}>
                    Añadir al carrito
                  </button>

                  <span className={`align-self-center fw-bold ${added ? "text-success" : "d-none"}`}>
                    ✔ Producto agregado
                  </span>
                </div>

                <div className="alert alert-light mt-4 mb-0">
                  <div className="d-flex gap-3 align-items-start">
                    <i className="fa-solid fa-truck-fast fs-4 text-primary" />
                    <div>
                      <div className="fw-semibold">Envío rápido</div>
                      <div className="small text-muted">Recibe en 24–72 hrs según región.</div>
                    </div>
                  </div>
                </div>

                {!user && (
                  <div className="small text-muted mt-2">
                    <i className="fa-solid fa-circle-info me-2" />
                    Para comprar ahora, primero debes iniciar sesión o crear cuenta.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sección extra */}
        <div className="row g-4 mt-4">
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <h4 className="h6 fw-bold">Contenido de la caja</h4>
                <ul className="small mb-0">
                  <li>Mouse Gamer</li>
                  <li>Receptor USB</li>
                  <li>Manual de usuario</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <h4 className="h6 fw-bold">Compatibilidad</h4>
                <p className="small text-muted mb-0">Windows / macOS / Linux (conexión USB).</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <h4 className="h6 fw-bold">Devoluciones</h4>
                <p className="small text-muted mb-0">7 días de devolución si el producto viene con falla.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

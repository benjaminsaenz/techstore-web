import { Link } from "react-router-dom";
import NavbarMain from "../components/NavbarMain.jsx";
import Footer from "../components/Footer.jsx";
import { useProducts } from "../hooks/useProducts.js";

/**
 * Categorías
 * - Vista extra: muestra categorías disponibles según products.json
 * - Cada categoría linkea a /productos?cat=...
 */
export default function Categorias() {
  const { products, loading, error } = useProducts();

  const categories = Array.from(new Set((products || []).map((p) => p.category))).sort();

  return (
    <>
      <NavbarMain />

      <section className="container my-5">
        <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
          <h2 className="m-0">📦 Categorías</h2>
          <Link to="/productos" className="btn btn-sm btn-outline-secondary ms-auto">
            Ver todos los productos
          </Link>
        </div>

        {loading && <div className="alert alert-info">Cargando categorías...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && (
          <div className="row g-3">
            {categories.map((c) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={c}>
                <Link
                  to={`/productos?cat=${encodeURIComponent(c)}`}
                  className="card text-decoration-none text-dark h-100"
                >
                  <div className="card-body">
                    <h5 className="card-title text-capitalize">{c}</h5>
                    <p className="card-text text-muted small mb-0">Ver productos de {c}</p>
                  </div>
                </Link>
              </div>
            ))}

            {categories.length === 0 && (
              <div className="col-12">
                <div className="alert alert-warning">No hay categorías disponibles.</div>
              </div>
            )}
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}

import { Link } from "react-router-dom";
import NavbarMain from "../components/NavbarMain.jsx";
import Footer from "../components/Footer.jsx";
import { useProducts } from "../hooks/useProducts.js";
import { addToCart, formatCLP } from "../utils/cart.js";

/**
 * Ofertas
 * - Vista extra (para completar la app)
 * - "Oferta" se determina por campo onSale en products.json
 *
 * Puedes editar public/data/products.json y marcar algunos productos con:
 * { "onSale": true, "salePercent": 20 }
 */
export default function Ofertas() {
  const { products, loading, error } = useProducts();

  const offers = (products || []).filter((p) => p.onSale === true);

  return (
    <>
      <NavbarMain />

      <section className="container my-5">
        <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
          <h2 className="m-0">🔥 Ofertas</h2>
          <span className="text-muted">(simulación)</span>
          <Link to="/productos" className="btn btn-sm btn-outline-secondary ms-auto">
            Ver todos
          </Link>
        </div>

        {loading && <div className="alert alert-info">Cargando ofertas...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && offers.length === 0 && (
          <div className="alert alert-warning">
            No hay ofertas configuradas. Marca productos con <code>onSale: true</code> en <code>public/data/products.json</code>.
          </div>
        )}

        <div className="row g-4">
          {offers.map((p) => {
            const percent = Number(p.salePercent || 0);
            const finalPrice = percent > 0 ? Math.round(p.price * (1 - percent / 100)) : p.price;

            return (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={p.id}>
                <div className="card h-100">
                  <img src={p.img} className="card-img-top" alt={p.name} />
                  <div className="card-body">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <h5 className="m-0">{p.name}</h5>
                      <span className="badge text-bg-danger ms-auto">OFERTA</span>
                    </div>

                    {percent > 0 ? (
                      <p className="mb-2">
                        <span className="text-muted text-decoration-line-through me-2">{formatCLP(p.price)}</span>
                        <span className="fw-bold">{formatCLP(finalPrice)}</span>
                        <span className="badge text-bg-dark ms-2">-{percent}%</span>
                      </p>
                    ) : (
                      <p className="fw-bold mb-2">{formatCLP(finalPrice)}</p>
                    )}

                    <button
                      className="btn btn-primary w-100"
                      type="button"
                      onClick={() => addToCart({ ...p, price: finalPrice })}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
    </>
  );
}

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import NavbarMain from "../components/NavbarMain.jsx";
import Footer from "../components/Footer.jsx";
import { CATEGORIES} from "../utils/products.js";
import { addToCart, formatCLP } from "../utils/cart.js";
import { useProducts } from "../hooks/useProducts";



export default function Productos() {
  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("todos");
  const [added, setAdded] = useState({});

  // ✅ ahora los productos vienen desde JSON vía Axios
  const { products, loading, error } = useProducts();

  const list = useMemo(() => {
    let items = products;

    if (categoria !== "todos") {
      items = items.filter((p) => p.category === categoria);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (Array.isArray(p.features) &&
            p.features.some((f) => String(f).toLowerCase().includes(q)))
      );
    }

    return items;
  }, [products, categoria, query]);

  const handleAdd = (p) => {
    addToCart(p);
    setAdded((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [p.id]: false })), 2000);
  };

  return (
    <>
      <NavbarMain />

      <section className="hero-productos text-white d-flex align-items-center">
        <div className="container text-center">
          <h1 className="fw-bold">Nuestros Productos</h1>
          <p>Accesorios tecnológicos para todos</p>
        </div>
      </section>

      <section className="container my-5">
        {/* Estados de carga/error */}
        {loading && (
          <div className="alert alert-info">Cargando productos...</div>
        )}

        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        {!loading && !error && (
          <>
            <p className="fw-bold">
              Productos encontrados: <span id="contador">{list.length}</span>
            </p>

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Buscar producto..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <div className="row mb-4">
              <div className="col-md-4">
                <label className="fw-bold">Filtrar por categoría</label>
                <select
                  className="form-select"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row g-4">
              {list.map((p) => (
                <div className="col-md-3" key={p.id}>
                  <div className="card h-100">
                    {p.id === "mouse1" ? (
                      <Link to="/producto-mouse" className="text-decoration-none text-dark">
                        <img src={p.img} className="card-img-top" alt={p.name} />
                      </Link>
                    ) : (
                      <img src={p.img} className="card-img-top" alt={p.name} />
                    )}

                    <div className="card-body">
                      <h5>{p.name}</h5>

                      <ul className="list-unstyled small">
                        {(p.features || []).slice(0, 3).map((f) => (
                          <li key={f}>🟣 {f}</li>
                        ))}
                      </ul>

                      <p className="fw-bold">{formatCLP(p.price)}</p>

                      <button
                        className="btn btn-primary w-100"
                        onClick={() => handleAdd(p)}
                      >
                        Agregar
                      </button>

                      <small className={`fw-bold ${added[p.id] ? "text-success" : "d-none"}`}>
                        ✔ Producto agregado
                      </small>
                    </div>
                  </div>
                </div>
              ))}

              {list.length === 0 && (
                <div className="col-12">
                  <div className="alert alert-warning m-0">
                    No hay productos para mostrar.
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </section>

      <Footer />
    </>
  );
}
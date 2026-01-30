import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link, useSearchParams } from "react-router-dom";
import NavbarMain from "../components/NavbarMain.jsx";
import Footer from "../components/Footer.jsx";
import { CATEGORIES } from "../utils/products.js";
import { addToCart, formatCLP } from "../utils/cart.js";
import { useProducts } from "../hooks/useProducts.js";

/**
 * Productos
 * - Carga catálogo desde el backend (Spring Boot)
 * - Permite filtrar por categoría y buscar por nombre/características
 * - Agrega productos al carrito (localStorage)
 */
export default function Productos() {
  const rootRef = useRef(null);
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState("");
  const [categoria, setCategoria] = useState("todos");
  const [added, setAdded] = useState({});

  const { products, loading, error } = useProducts();

  // Permite abrir la vista filtrada desde /categorias -> /productos?cat=...
  useEffect(() => {
    const cat = searchParams.get("cat");
    if (cat) setCategoria(cat);
  }, [searchParams]);

  // ✅ Animaciones suaves al entrar a la página (solo cuando ya cargó el catálogo)
  useLayoutEffect(() => {
    if (loading || error) return;

    gsap.registerPlugin(ScrollTrigger);
    const hoverCleanups = [];

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.from(".ts-productos-hero .container > *", {
        opacity: 0,
        y: 22,
        duration: 0.7,
        stagger: 0.12,
      });

      tl.from(
        ".ts-productos-grid .card",
        {
          opacity: 0,
          y: 18,
          duration: 0.55,
          stagger: 0.06,
        },
        "-=0.25"
      );

      // Reveal sutil al hacer scroll (por si la grilla es larga)
      gsap.from(".ts-productos-grid", {
        scrollTrigger: {
          trigger: ".ts-productos-grid",
          start: "top 85%",
          once: true,
        },
        opacity: 0,
        y: 12,
        duration: 0.6,
      });

      // Hover pro en cards (GSAP)
      gsap.utils.toArray(".ts-product-card").forEach((el) => {
        const onEnter = () =>
          gsap.to(el, { y: -8, duration: 0.22, ease: "power2.out" });
        const onLeave = () => gsap.to(el, { y: 0, duration: 0.22, ease: "power2.out" });
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
        hoverCleanups.push(() => {
          el.removeEventListener("mouseenter", onEnter);
          el.removeEventListener("mouseleave", onLeave);
        });
      });
    }, rootRef);

    return () => {
      hoverCleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, [loading, error]);

  const list = useMemo(() => {
    let items = products;

    if (categoria !== "todos") {
      items = items.filter((p) => p.category === categoria);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter((p) => p.name.toLowerCase().includes(q));
    }

    return items;
  }, [products, categoria, query]);

  const handleAdd = (p, evt) => {
    if (evt?.currentTarget) {
      gsap.fromTo(
        evt.currentTarget,
        { scale: 1 },
        { scale: 1.12, duration: 0.18, yoyo: true, repeat: 1, ease: "power1.out" }
      );
    }
    addToCart(p);
    setAdded((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [p.id]: false })), 2000);
  };

 

  return (
    <>
      <NavbarMain />

      <div ref={rootRef}>
      <section className="hero-productos text-white d-flex align-items-center ts-productos-hero">
        <div className="container text-center">
          <h1 className="fw-bold">Nuestros Productos</h1>
          <p>Accesorios tecnológicos para todos</p>
        </div>
      </section>

      <section className="container my-5">
        {loading && <div className="alert alert-info">Cargando productos...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

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

        <div className="row g-4  ts-dark ts-productos-grid">
              {list.map((p) => (
                <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={p.id}>
                  <div className="card h-100 ts-product-card">
                    <Link to={`/producto/${p.id}`} className="text-decoration-none">
                      <img
                        src={p.imageUrl || "/img/productos4.jpg"}
                        className="card-img-top"
                        alt={p.name}
                      />
                    </Link>

                    <div className="card-body">
                      <h5 className="mb-1">
                        <Link to={`/producto/${p.id}`} className="text-decoration-none text-dark">
                          {p.name}
                        </Link>
                      </h5>


                      <div className="small text-muted mb-2">Categoría: {p.category}</div>

                      <p className="fw-bold">{formatCLP(p.price)}</p>
                      <div className="small mb-2">Stock: {p.stock}</div>

                      <div className="d-grid gap-2">
                        <button
                          className="btn btn-primary"
                          onClick={(e) => handleAdd(p, e)}
                          type="button"
                        >
                          Agregar al carrito
                        </button>

                        <Link to={`/producto/${p.id}`} className="btn btn-outline-secondary">
                          Ver detalle
                        </Link>
                      </div>

                      <small className={`fw-bold ${added[p.id] ? "text-success" : "d-none"}`}>
                        ✔ Producto agregado
                      </small>
                    </div>
                  </div>
                </div>
              ))}

              {list.length === 0 && (
                <div className="col-12">
                  <div className="alert alert-warning m-0">No hay productos para mostrar.</div>
                </div>
              )}
            </div>
          </>
        )}
      </section>

      </div>
      <Footer />
    </>
  );
}

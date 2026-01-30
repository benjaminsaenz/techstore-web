import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

import NavbarMain from "../components/NavbarMain.jsx";
import Footer from "../components/Footer.jsx";

// Consumimos productos reales desde el backend
import { useProducts } from "../hooks/useProducts.js";

import { addToCart, formatCLP } from "../utils/cart.js";

gsap.registerPlugin(ScrollTrigger);

function normalizeProductHome(p) {
  if (!p) return null;
  // Backend suele venir con imageUrl o image_url (y a veces con img en mocks)
  const imageUrl = p.imageUrl || p.image_url || p.img || "";
  return { ...p, imageUrl };
}

export default function Home() {
  const [addedId, setAddedId] = useState(null);
  const lastClickAt = useRef(0);

  const { products: apiProducts, loading: loadingProducts } = useProducts();
  const products = useMemo(() => (apiProducts || []).map(normalizeProductHome).filter(Boolean), [apiProducts]);

  // Carrusel: usa más productos (y por ende más imágenes)
  const carouselItems = useMemo(() => {
    // Preferimos mostrar los primeros (backend ya viene ordenado por id)
    return products.slice(0, 8);
  }, [products]);

  const destacados = useMemo(() => products.slice(0, 8), [products]);

  const handleAdd = (p, e) => {
    e.preventDefault();
    const now = Date.now();
    if (now - lastClickAt.current < 250) return; // anti-spam
    lastClickAt.current = now;

    addToCart(p);
    setAddedId(p.id);
    window.dispatchEvent(new CustomEvent("techstore:cart"));

    setTimeout(() => setAddedId(null), 650);
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Hero
      gsap.from(".ts-hero .ts-hero-copy > *", {
        opacity: 0,
        y: 18,
        duration: 0.7,
        stagger: 0.12,
        ease: "power2.out",
      });

      // Carrusel
      gsap.from(".ts-carousel-wrap", {
        opacity: 0,
        y: 18,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".ts-carousel-wrap",
          start: "top 85%",
        },
      });

      // Trust bar
      gsap.from(".ts-trustbar .ts-trust-item", {
        opacity: 0,
        y: 14,
        duration: 0.55,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".ts-trustbar",
          start: "top 85%",
        },
      });

      // Destacados
      gsap.from(".ts-destacados .product-card", {
        opacity: 0,
        y: 18,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".ts-destacados",
          start: "top 80%",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <NavbarMain />

      {/* HERO */}
      <section className="ts-hero hero">
        <div className="container py-5">
          <div className="row align-items-center g-4">
            <div className="col-lg-6 ts-hero-copy">
              <h1 className="display-5 fw-bold text-white mb-2">TechStore</h1>
              <p className="lead text-white-50 mb-4">
                Accesorios tecnológicos, ofertas reales y una experiencia de compra rápida.
              </p>

              <div className="d-flex gap-2 flex-wrap">
                <a href="#destacados" className="btn btn-primary btn-lg">
                  Ver destacados
                </a>
                <Link to="/productos" className="btn btn-outline-light btn-lg">
                  Catálogo
                </Link>
              </div>
            </div>

            <div className="col-lg-6">
              {/* Compacto: imagen/preview */}
              <div className="ts-carousel-wrap">
                <div id="carouselProductos" className="carousel slide" data-bs-ride="carousel">
                  <div className="carousel-indicators">
                    {carouselItems.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        data-bs-target="#carouselProductos"
                        data-bs-slide-to={idx}
                        className={idx === 0 ? "active" : ""}
                        aria-current={idx === 0 ? "true" : undefined}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <div className="carousel-inner">
                    {carouselItems.map((p, idx) => (
                      <div className={`carousel-item ${idx === 0 ? "active" : ""}`} key={p.id}>
                        <Link to={`/producto/${p.id}`} className="d-block">
                          <img
                            src={p.imageUrl || p.img || "/img/productos4.jpg"}
                            className="d-block w-100 ts-carousel-img"
                            alt={p.name}
                            loading={idx === 0 ? "eager" : "lazy"}
                          />
                        </Link>
                        <div className="carousel-caption ts-carousel-caption">
                          <div className="d-inline-flex align-items-center gap-2 mb-2">
                            <span className="badge text-bg-dark text-uppercase">{p.category}</span>
                            {p.onSale ? (
                              <span className="badge text-bg-danger">-{p.salePercent || 0}%</span>
                            ) : null}
                          </div>

                          <h5 className="mb-1 fw-bold">{p.name}</h5>
                          <p className="mb-3">{formatCLP(p.price)}</p>

                          <div className="small opacity-75"></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselProductos"
                    data-bs-slide="prev"
                  >
                    <span className="carousel-control-prev-icon" aria-hidden="true" />
                    <span className="visually-hidden">Previous</span>
                  </button>

                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselProductos"
                    data-bs-slide="next"
                  >
                    <span className="carousel-control-next-icon" aria-hidden="true" />
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              </div>

              <div className="row g-3 mt-3 ts-trustbar home-benefits">
  <div className="col-md-4">
    <div className="ts-trust-item benefit-card">
      <i className="fa-solid fa-truck-fast benefit-icon" />
      <div>
        <div className="benefit-title">Despacho rápido</div>
        <div className="benefit-text">Entregas a todo Chile</div>
      </div>
    </div>
  </div>

  <div className="col-md-4">
    <div className="ts-trust-item benefit-card">
      <i className="fa-solid fa-shield-halved benefit-icon" />
      <div>
        <div className="benefit-title">Compra segura</div>
        <div className="benefit-text">Protección + soporte</div>
      </div>
    </div>
  </div>

  <div className="col-md-4">
    <div className="ts-trust-item benefit-card">
      <i className="fa-solid fa-headset benefit-icon" />
      <div>
        <div className="benefit-title">Soporte</div>
        <div className="benefit-text">Atención personalizada</div>
      </div>
    </div>
  </div>


              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DESTACADOS */}
      <section id="destacados" className="ts-destacados  ts-dark container py-4">
        <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
          <h3 className="m-0">Destacados</h3>
          <Link to="/productos" className="btn btn-outline-secondary btn-sm">
            Ver todo
          </Link>
        </div>

        <div className="row g-4">
          {destacados.map((p) => (
            <div className="col-6 col-md-4 col-lg-3" key={p.id}>
              <Link to={`/producto/${p.id}`} className="text-decoration-none">
                <div className="product-card card h-100 shadow-sm">
                  <img
                    src={p.imageUrl || "/img/productos4.jpg"}
                    className="card-img-top product-img"
                    alt={p.name}
                    loading="lazy"
                  />
                  <div className="card-body d-flex flex-column">
                    <h6 className="card-title text-dark mb-1">{p.name}</h6>
                    <div className="text-muted small mb-2 text-capitalize">{p.category}</div>

                    <div className="mt-auto d-flex align-items-center justify-content-between gap-2">
                      <div className="fw-bold text-dark">{formatCLP(p.price)}</div>
                      <button className="btn btn-primary btn-sm" onClick={(e) => handleAdd(p, e)}>
                        {addedId === p.id ? "✔" : "Agregar"}
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

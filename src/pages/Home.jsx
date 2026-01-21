import { useState } from "react";
import { Link } from "react-router-dom";
import NavbarMain from "../components/NavbarMain.jsx";
import Footer from "../components/Footer.jsx";
import { PRODUCTS } from "../utils/products.js";
import { addToCart, formatCLP } from "../utils/cart.js";

export default function Home() {
  const [added, setAdded] = useState({});

  const handleAdd = (product) => {
    addToCart(product);
    setAdded((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAdded((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const destacados = PRODUCTS.filter((p) => ["teclado1", "mouse1", "audifonos1", "monitor1"].includes(p.id));

  return (
    <>
      <NavbarMain />

      <header className="hero text-white text-center d-flex align-items-center">
        <div className="container ts-hero-content">
          <h1 className="fw-bold ts-fade-up">Bienvenido a TechStore</h1>
          <p className="lead ts-fade-up ts-delay-1">Accesorios tecnológicos al mejor precio</p>

          <div className="d-flex justify-content-center gap-2 flex-wrap mt-3 ts-fade-up ts-delay-2">
            <Link to="/productos" className="btn btn-primary btn-lg ts-btn-pop">
              Ver productos
            </Link>
            <Link to="/contacto" className="btn btn-outline-light btn-lg">
              Contacto
            </Link>
          </div>
        </div>
      </header>

      <div id="carouselProductos" className="carousel slide mb-5" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="/img/teclado1.jpg" className="d-block w-100" alt="Teclado" />
            <div className="carousel-caption d-none d-md-block">
              <h5>Teclado Gamer</h5>
              <p>$39.990 CLP</p>
            </div>
          </div>

          <div className="carousel-item">
            <img src="/img/mouse.jpg" className="d-block w-100" alt="Mouse" />
            <div className="carousel-caption d-none d-md-block">
              <h5>Mouse Gamer</h5>
              <p>$19.990 CLP</p>
            </div>
          </div>

          <div className="carousel-item">
            <img src="/img/audifonos1.jpg" className="d-block w-100" alt="Audífonos" />
            <div className="carousel-caption d-none d-md-block">
              <h5>Audífonos Gamer</h5>
              <p>$29.990 CLP</p>
            </div>
          </div>
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#carouselProductos" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Previous</span>
        </button>

        <button className="carousel-control-next" type="button" data-bs-target="#carouselProductos" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* Beneficios (con fondo en CSS) */}
      <section className="ts-beneficios my-5">
        <div className="container py-5">
          <div className="row text-center text-white">
          <div className="col-md-4">
            <i className="fa-solid fa-truck-fast fs-1 mb-3" />
            <h5 className="fw-bold">Despacho rápido</h5>
            <p className="mb-0">Entregas a todo Chile</p>
          </div>

          <div className="col-md-4">
            <i className="fa-solid fa-shield-halved fs-1 mb-3" />
            <h5 className="fw-bold">Compra segura</h5>
            <p className="mb-0">Protegemos tus datos</p>
          </div>

          <div className="col-md-4">
            <i className="fa-solid fa-headset fs-1 mb-3" />
            <h5 className="fw-bold">Soporte 24/7</h5>
            <p className="mb-0">Atención personalizada</p>
          </div>
          </div>
        </div>
      </section>

      <section className="container my-5 ts-section">
        <h2 className="text-center mb-4 ts-fade-up">Productos Destacados</h2>

        <div className="row g-4">
          {destacados.map((p) => (
            <div className="col-md-3" key={p.id}>
              <div className="card h-100">
                <img src={p.img} className="card-img-top" alt={p.name} />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>

                  <ul className="list-unstyled small">
                    {p.features.map((f) => (
                      <li key={f}>🟣 {f}</li>
                    ))}
                  </ul>

                  <p className="fw-bold">{formatCLP(p.price)}</p>

                  <button className="btn btn-primary w-100" onClick={() => handleAdd(p)}>
                    Agregar
                  </button>

                  <small className={`fw-bold ${added[p.id] ? "text-success" : "d-none"}`}>
                    ✔ Producto agregado
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}

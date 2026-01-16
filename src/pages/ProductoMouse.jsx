import { useState } from "react";
import NavbarMain from "../components/NavbarMain.jsx";
import Footer from "../components/Footer.jsx";
import { PRODUCTS } from "../utils/products.js";
import { addToCart, formatCLP } from "../utils/cart.js";

export default function ProductoMouse() {
  const mouse = PRODUCTS.find((p) => p.id === "mouse1");
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(mouse);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <>
      <NavbarMain />

      <main className="container my-5">
        <div className="row g-4">
          <div className="col-md-6">
            <img src={mouse.img} className="img-fluid rounded" alt={mouse.name} />
          </div>
          <div className="col-md-6">
            <h2 className="fw-bold">{mouse.name}</h2>
            <p className="fs-4 fw-bold">{formatCLP(mouse.price)}</p>

            <h5 className="mt-4">Características</h5>
            <ul>
              {mouse.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>

            <button className="btn btn-primary" type="button" onClick={handleAdd}>
              Agregar al carrito
            </button>

            <p className={`mt-2 fw-bold ${added ? "text-success" : "d-none"}`}>✔ Producto agregado</p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

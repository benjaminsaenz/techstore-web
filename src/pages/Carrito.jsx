import { useEffect, useMemo, useState } from "react";
import { gsap } from "gsap";
import { Link, useNavigate } from "react-router-dom";
import NavbarMain from "../components/NavbarMain.jsx";
import Footer from "../components/Footer.jsx";
import { formatCLP, getCart, saveCart } from "../utils/cart.js";

/**
 * Carrito
 * - Muestra productos agregados y permite modificar cantidad/eliminar
 * - ✅ Limpieza: SOLO botón Checkout (las opciones APROBADA/RECHAZADA viven en /checkout)
 */
export default function Carrito() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getCart());
  }, []);

  const updateQty = (id, delta) => {
    const next = items.map((it) =>
      it.id === id ? { ...it, qty: Math.max(1, (it.qty || 1) + delta) } : it
    );
    setItems(next);
    saveCart(next);
  };

  const removeItem = (id) => {
    const next = items.filter((it) => it.id !== id);
    setItems(next);
    saveCart(next);
  };

  const total = useMemo(
    () => items.reduce((acc, it) => acc + Number(it.price) * Number(it.qty || 1), 0),
    [items]
  );

  const goCheckout = (evt) => {
    if (evt?.currentTarget) {
      gsap.fromTo(
        evt.currentTarget,
        { scale: 1 },
        { scale: 1.08, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" }
      );
    }
    navigate("/checkout");
  };

  return (
    <>
      <NavbarMain />

      <main className="container my-5">
        <h2 className="mb-4">🛒 Carrito de Compras</h2>

        {items.length === 0 ? (
          <div className="alert alert-info">
            Tu carrito está vacío. <Link to="/productos">Ir a productos</Link>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-dark">
                  <tr>
                    <th>Producto</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id}>
                      <td>
                        <img src={it.imageUrl || it.img || "/img/productos4.jpg"} width="70" alt={it.name} />
                      </td>
                      <td>{it.name}</td>
                      <td>{formatCLP(it.price)}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            type="button"
                            onClick={() => updateQty(it.id, -1)}
                          >
                            -
                          </button>
                          <span className="fw-bold">{it.qty}</span>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            type="button"
                            onClick={() => updateQty(it.id, 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>{formatCLP(it.price * (it.qty || 0))}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          type="button"
                          onClick={() => removeItem(it.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <Link to="/productos" className="btn btn-secondary">
                ⬅ Seguir comprando
              </Link>

              <div className="text-end">
                <p className="fw-bold fs-5 mb-2">Total: {formatCLP(total)}</p>
                <button className="btn btn-success" onClick={(e) => goCheckout(e)} type="button">
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}

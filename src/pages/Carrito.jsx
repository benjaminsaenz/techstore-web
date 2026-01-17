import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavbarMain from "../components/NavbarMain.jsx";
import Footer from "../components/Footer.jsx";
import { clearCart, formatCLP, getCart, saveCart } from "../utils/cart.js";
import { createReceipt, registerSaleIfApproved, saveLastReceipt } from "../utils/checkout.js";

/**
 * Carrito
 * - Muestra productos agregados y permite modificar cantidad/eliminar
 * - Botones simulación de pago: APROBADA/RECHAZADA
 * - Para flujo "más completo", también existe la ruta /checkout
 */
export default function Carrito() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [payError, setPayError] = useState("");

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

  const payApproved = () => {
    setPayError("");
    if (!items.length) return setPayError("No hay productos en el carrito.");
    if (total <= 0) return setPayError("El total no puede ser 0 o negativo.");

    const receipt = createReceipt({ status: "APROBADA", items });
    saveLastReceipt(receipt);
    registerSaleIfApproved(receipt);

    clearCart();
    setItems([]);

    navigate("/pago-exitoso");
  };

  const payRejected = () => {
    setPayError("❌ No se realizó el pago. Intenta nuevamente o usa otro medio.");

    if (!items.length) return;

    const receipt = createReceipt({ status: "RECHAZADA", items });
    saveLastReceipt(receipt);

    navigate("/pago-error");
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
                        <img src={it.img} width="70" alt={it.name} style={{ objectFit: "cover" }} />
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

            <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
              <Link to="/productos" className="btn btn-secondary">
                ⬅ Seguir comprando
              </Link>

              <div className="text-end">
                <p className="fw-bold fs-5 mb-2">Total: {formatCLP(total)}</p>

                <div className="d-flex gap-2 justify-content-end flex-wrap">
                  <Link to="/checkout" className="btn btn-outline-dark">
                    Ir a Checkout
                  </Link>
                  <button className="btn btn-success" onClick={payApproved} type="button">
                    ✅ Compra aprobada
                  </button>
                  <button className="btn btn-danger" onClick={payRejected} type="button">
                    ❌ Pago rechazado
                  </button>
                </div>
              </div>
            </div>

            {payError && <div className="alert alert-danger mt-3 mb-0">{payError}</div>}
          </>
        )}
      </main>

      <Footer />
    </>
  );
}

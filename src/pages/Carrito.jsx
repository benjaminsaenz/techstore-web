import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import NavbarMain from "../components/NavbarMain.jsx";
import Footer from "../components/Footer.jsx";
import { clearCart, formatCLP, getCart, saveCart } from "../utils/cart.js";
import { createReceipt, registerSaleIfApproved, saveLastReceipt } from "../utils/checkout.js";

export default function Carrito() {
  const [items, setItems] = useState([]);
  const [receipt, setReceipt] = useState(null);
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

  const total = useMemo(() => {
    return items.reduce((acc, it) => acc + Number(it.price) * Number(it.qty || 1), 0);
  }, [items]);

  const handleApproved = () => {
    setPayError("");

    if (items.length === 0) {
      setPayError("No hay productos en el carrito.");
      return;
    }
    if (total <= 0) {
      setPayError("El total no puede ser 0 o negativo.");
      return;
    }

    const r = createReceipt({ status: "APROBADA", items });
    saveLastReceipt(r);
    registerSaleIfApproved(r);

    // ✅ vaciar carrito porque fue aprobada
    clearCart();
    setItems([]);

    setReceipt(r);
  };

  const handleRejected = () => {
    const r = createReceipt({ status: "RECHAZADA", items });
    saveLastReceipt(r);
    setReceipt(r);
    setPayError("❌ No se realizó el pago. Intenta nuevamente o usa otro medio.");
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
                        <img src={it.img} width="70" alt={it.name} />
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

                {/* ✅ botones nuevos */}
                <div className="d-flex gap-2 justify-content-end flex-wrap">
                  <button className="btn btn-success" onClick={handleApproved} type="button">
                    ✅ Compra aprobada
                  </button>
                  <button className="btn btn-danger" onClick={handleRejected} type="button">
                    ❌ Pago rechazado
                  </button>
                </div>
              </div>
            </div>

            {payError && <div className="alert alert-danger mt-3 mb-0">{payError}</div>}
          </>
        )}

        {/* ✅ Boleta / comprobante */}
        {receipt && (
          <div className="card mt-4">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <h5 className="m-0">Boleta / Comprobante</h5>
                <span
                  className={`ms-auto badge ${
                    receipt.status === "APROBADA" ? "text-bg-success" : "text-bg-danger"
                  }`}
                >
                  {receipt.status}
                </span>
              </div>

              <hr />

              <div className="row g-3">
                <div className="col-md-6">
                  <div className="small text-muted">ID</div>
                  <div className="fw-bold">{receipt.id}</div>

                  <div className="small text-muted mt-2">Fecha</div>
                  <div>{new Date(receipt.dateISO).toLocaleString("es-CL")}</div>
                </div>

                <div className="col-md-6">
                  <div className="small text-muted">Cliente</div>
                  <div className="fw-bold">{receipt.customer?.name}</div>

                  <div className="small text-muted mt-2">Correo</div>
                  <div>{receipt.customer?.email}</div>

                  <div className="small text-muted mt-2">Dirección</div>
                  <div>{receipt.customer?.address}</div>
                </div>
              </div>

              <div className="table-responsive mt-4">
                <table className="table table-sm align-middle">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th className="text-end">Precio</th>
                      <th className="text-end">Cant.</th>
                      <th className="text-end">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(receipt.items || []).map((it) => (
                      <tr key={it.id}>
                        <td>{it.name}</td>
                        <td className="text-end">{formatCLP(it.price)}</td>
                        <td className="text-end">{it.qty}</td>
                        <td className="text-end">{formatCLP(it.price * it.qty)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan={3} className="text-end">
                        TOTAL
                      </th>
                      <th className="text-end">{formatCLP(receipt.total)}</th>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="d-flex gap-2 flex-wrap">
                <button className="btn btn-outline-secondary" onClick={() => window.print()} type="button">
                  🖨️ Imprimir
                </button>
                <button className="btn btn-outline-primary" onClick={() => setReceipt(null)} type="button">
                  Cerrar boleta
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}


import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavbarMain from "../components/NavbarMain.jsx";
import Footer from "../components/Footer.jsx";
import { getCart, clearCart, formatCLP } from "../utils/cart.js";
import { createReceipt, saveLastReceipt, registerSale } from "../utils/checkout.js";
import { getCurrentUser } from "../utils/auth.js";

/**
 * Checkout (Resumen)
 * Flujo:
 * 1) Si no hay usuario logueado => manda a /registro (crear cuenta)
 * 2) Luego vuelve a /checkout y muestra:
 *    - Datos del cliente
 *    - Resumen de compra
 *    - Botones: Compra aprobada / Compra rechazada
 */
export default function Checkout() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const user = getCurrentUser();

  useEffect(() => {
    // ✅ requisito: al entrar a checkout, primero crear cuenta
    if (!user) {
      navigate(`/registro?redirect=${encodeURIComponent("/checkout")}`, { replace: true });
      return;
    }
    setItems(getCart());
  }, [navigate]);

  const total = useMemo(
    () => items.reduce((acc, it) => acc + Number(it.price) * Number(it.qty || 1), 0),
    [items]
  );

  const validate = () => {
    if (!user) return "Debes crear cuenta para continuar.";
    if (!items.length) return "No hay productos en el carrito.";
    if (total <= 0) return "El total no puede ser 0 o negativo.";
    return "";
  };

  const approve = () => {
    const msg = validate();
    if (msg) return setError(msg);

    const receipt = createReceipt({
      status: "APROBADA",
      items,
      customerOverride: {
        name: user.name,
        email: user.email,
        address: user.address,
      },
    });

    saveLastReceipt(receipt);
    registerSale(receipt);

    // ✅ Aprobada: vacía carrito
    clearCart();
    setItems([]);

    navigate("/pago-exitoso");
  };

  const reject = () => {
    const msg = validate();
    if (msg) return setError(msg);

    const receipt = createReceipt({
      status: "RECHAZADA",
      items,
      customerOverride: {
        name: user.name,
        email: user.email,
        address: user.address,
      },
    });

    // Motivo más “profesional” (simulado)
    receipt.reason = "Pago rechazado: fondos insuficientes o medio no válido.";

    // ✅ Rechazada: guarda boleta y registra venta RECHAZADA, pero no borra carrito
    saveLastReceipt(receipt);
    registerSale(receipt);

    navigate("/pago-error");
  };

  return (
    <>
      <NavbarMain />

      <main className="container my-5">
        <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
          <h2 className="m-0">🧾 Checkout</h2>
          <span className="text-muted">(resumen)</span>
          <Link to="/carrito" className="btn btn-sm btn-outline-secondary ms-auto">
            ⬅ Volver al carrito
          </Link>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {items.length === 0 ? (
          <div className="alert alert-info">
            No hay productos para pagar. <Link to="/productos">Ir a productos</Link>
          </div>
        ) : (
          <div className="row g-4">
            {/* Datos cliente */}
            <div className="col-12 col-lg-5">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Datos del cliente</h5>
                  <div className="small text-muted">(recien registrado / sesión activa)</div>

                  <hr />

                  <div className="mb-2">
                    <div className="text-muted small">Nombre</div>
                    <div className="fw-bold">{user?.name}</div>
                  </div>
                  <div className="mb-2">
                    <div className="text-muted small">Correo</div>
                    <div className="fw-bold">{user?.email}</div>
                  </div>
                  <div>
                    <div className="text-muted small">Dirección</div>
                    <div className="fw-bold">{user?.address}</div>
                  </div>

                  <div className="d-flex gap-2 flex-wrap mt-4">
                    <button className="btn btn-success" type="button" onClick={approve}>
                      ✅ Compra aprobada
                    </button>
                    <button className="btn btn-danger" type="button" onClick={reject}>
                      ❌ Compra rechazada
                    </button>
                  </div>

                  <p className="small text-muted mt-3 mb-0">
                    Nota: simulación sin backend. La boleta y las ventas se guardan en localStorage.
                  </p>
                </div>
              </div>
            </div>

            {/* Resumen */}
            <div className="col-12 col-lg-7">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Resumen de compra</h5>

                  <ul className="list-group list-group-flush">
                    {items.map((it) => (
                      <li key={it.id} className="list-group-item d-flex align-items-center gap-2">
                        <img
                          src={it.img}
                          alt={it.name}
                          width="48"
                          height="48"
                          style={{ objectFit: "cover" }}
                          className="rounded border"
                        />
                        <div className="flex-grow-1">
                          <div className="fw-bold">{it.name}</div>
                          <div className="small text-muted">
                            {it.qty} x {formatCLP(it.price)}
                          </div>
                        </div>
                        <div className="fw-bold">{formatCLP(it.price * (it.qty || 1))}</div>
                      </li>
                    ))}
                  </ul>

                  <div className="d-flex justify-content-between mt-3">
                    <span className="fw-bold">Total</span>
                    <span className="fw-bold">{formatCLP(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

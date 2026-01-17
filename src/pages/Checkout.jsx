import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavbarMain from "../components/NavbarMain.jsx";
import Footer from "../components/Footer.jsx";
import { getCart, clearCart, saveCart, formatCLP } from "../utils/cart.js";
import { createReceipt, saveLastReceipt, registerSaleIfApproved } from "../utils/checkout.js";

/**
 * Checkout
 * - Paso intermedio (sin backend): el usuario ingresa datos de envío
 * - Botones de simulación: pago aprobado / pago rechazado
 * - Genera boleta y redirige a páginas de resultado.
 */
export default function Checkout() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  // Datos del cliente (simulados)
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    address: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    setItems(getCart());
  }, []);

  const total = useMemo(
    () => items.reduce((acc, it) => acc + Number(it.price) * Number(it.qty || 1), 0),
    [items]
  );

  const updateCustomer = (key, value) => {
    setCustomer((c) => ({ ...c, [key]: value }));
  };

  const validate = () => {
    if (!items.length) return "No hay productos en el carrito.";
    if (total <= 0) return "El total no puede ser 0 o negativo.";
    if (customer.name.trim().length < 3) return "Nombre muy corto.";
    if (!customer.email.includes("@")) return "Correo inválido.";
    if (customer.address.trim().length < 5) return "Dirección muy corta.";
    return "";
  };

  const payApproved = () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    const receipt = createReceipt({
      status: "APROBADA",
      items,
      customerOverride: customer,
    });

    saveLastReceipt(receipt);
    registerSaleIfApproved(receipt);

    // Vaciar carrito si fue aprobada
    clearCart();
    setItems([]);
    saveCart([]);

    navigate("/pago-exitoso");
  };

  const payRejected = () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    const receipt = createReceipt({
      status: "RECHAZADA",
      items,
      customerOverride: customer,
    });

    saveLastReceipt(receipt);
    navigate("/pago-error");
  };

  return (
    <>
      <NavbarMain />

      <main className="container my-5">
        <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
          <h2 className="m-0">🧾 Checkout</h2>
          <span className="text-muted">(simulación sin backend)</span>
          <Link to="/carrito" className="btn btn-sm btn-outline-secondary ms-auto">
            ⬅ Volver al carrito
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="alert alert-info">
            No hay productos para pagar. <Link to="/productos">Ir a productos</Link>
          </div>
        ) : (
          <div className="row g-4">
            {/* Formulario */}
            <div className="col-12 col-lg-7">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Datos del cliente / envío</h5>

                  {error && <div className="alert alert-danger">{error}</div>}

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Nombre</label>
                      <input
                        className="form-control"
                        value={customer.name}
                        onChange={(e) => updateCustomer("name", e.target.value)}
                        placeholder="Ej: Juan Pérez"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Correo</label>
                      <input
                        type="email"
                        className="form-control"
                        value={customer.email}
                        onChange={(e) => updateCustomer("email", e.target.value)}
                        placeholder="cliente@email.com"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-bold">Dirección</label>
                      <input
                        className="form-control"
                        value={customer.address}
                        onChange={(e) => updateCustomer("address", e.target.value)}
                        placeholder="Calle 123, comuna, ciudad"
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-2 flex-wrap mt-4">
                    <button className="btn btn-success" type="button" onClick={payApproved}>
                      ✅ Pagar (Aprobado)
                    </button>
                    <button className="btn btn-danger" type="button" onClick={payRejected}>
                      ❌ Pagar (Rechazado)
                    </button>
                  </div>

                  <p className="small text-muted mt-3 mb-0">
                    Nota: esto es una simulación. La boleta se guarda en localStorage.
                  </p>
                </div>
              </div>
            </div>

            {/* Resumen */}
            <div className="col-12 col-lg-5">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Resumen</h5>

                  <ul className="list-group list-group-flush">
                    {items.map((it) => (
                      <li key={it.id} className="list-group-item d-flex align-items-center gap-2">
                        <img src={it.img} alt={it.name} width="48" height="48" style={{ objectFit: "cover" }} className="rounded border" />
                        <div className="flex-grow-1">
                          <div className="fw-bold">{it.name}</div>
                          <div className="small text-muted">{it.qty} x {formatCLP(it.price)}</div>
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

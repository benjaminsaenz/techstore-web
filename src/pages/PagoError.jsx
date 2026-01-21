import { Link } from "react-router-dom";
import NavbarMain from "../components/NavbarMain.jsx";
import Footer from "../components/Footer.jsx";
import ReceiptCard from "../components/ReceiptCard.jsx";
import { getLastReceipt, clearLastReceipt } from "../utils/checkout.js";

/**
 * Página de resultado: Pago fallido
 */
export default function PagoError() {
  const receipt = getLastReceipt();

  return (
    <>
      <NavbarMain />

      <main className="container my-5">
        <div className="alert alert-danger">
          <h4 className="m-0">❌ No se pudo realizar el pago</h4>
          <div className="small">Simulación: el carrito no fue vaciado para que puedas reintentar.</div>
          {receipt?.reason && <div className="small mt-1">Motivo: <strong>{receipt.reason}</strong></div>}
        </div>

        {!receipt ? (
          <div className="alert alert-warning">
            No hay comprobante para mostrar. <Link to="/carrito">Volver al carrito</Link>
          </div>
        ) : (
          <ReceiptCard
            receipt={receipt}
            onClose={() => {
              clearLastReceipt();
              window.location.href = "/carrito";
            }}
          />
        )}

        <div className="d-flex gap-2 flex-wrap mt-4">
          <Link to="/carrito" className="btn btn-danger">
            Volver al carrito
          </Link>
          <Link to="/checkout" className="btn btn-outline-dark">
            Intentar pagar nuevamente
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}

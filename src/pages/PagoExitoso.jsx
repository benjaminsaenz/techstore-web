import { Link } from "react-router-dom";
import NavbarMain from "../components/NavbarMain.jsx";
import Footer from "../components/Footer.jsx";
import ReceiptCard from "../components/ReceiptCard.jsx";
import { getLastReceipt, clearLastReceipt } from "../utils/checkout.js";

/**
 * Página de resultado: Compra exitosa
 */
export default function PagoExitoso() {
  const receipt = getLastReceipt();

  return (
    <>
      <NavbarMain />

      <main className="container my-5">
        <div className="alert alert-success">
          <h4 className="m-0">✅ Compra aprobada</h4>
          <div className="small">Se generó la boleta correctamente.</div>
        </div>

        {!receipt ? (
          <div className="alert alert-warning">
            No hay boleta para mostrar. <Link to="/productos">Volver a productos</Link>
          </div>
        ) : (
          <ReceiptCard
            receipt={receipt}
            onClose={() => {
              clearLastReceipt();
              window.location.href = "/productos";
            }}
          />
        )}

        <div className="d-flex gap-2 flex-wrap mt-4">
          <Link to="/productos" className="btn btn-primary">
            Seguir comprando
          </Link>
          <Link to="/admin/ventas" className="btn btn-outline-secondary">
            Ver ventas (Admin)
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}

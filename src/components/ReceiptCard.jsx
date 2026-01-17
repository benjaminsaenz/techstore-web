/**
 * ReceiptCard
 * - Muestra boleta/comprobante de compra (aprobada o rechazada)
 * - Lee un objeto receipt (ver utils/checkout.js)
 * - Reutilizable en Carrito, PagoExitoso y PagoError
 */

import { formatCLP } from "../utils/cart.js";

export default function ReceiptCard({ receipt, onClose }) {
  if (!receipt) return null;

  const isOk = receipt.status === "APROBADA";

  return (
    <div className="card mt-4">
      <div className="card-body">
        <div className="d-flex align-items-center">
          <h5 className="m-0">Boleta / Comprobante</h5>
          <span className={`ms-auto badge ${isOk ? "text-bg-success" : "text-bg-danger"}`}>
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
          {onClose && (
            <button className="btn btn-outline-primary" onClick={onClose} type="button">
              Cerrar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

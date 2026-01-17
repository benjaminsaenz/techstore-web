import { useEffect, useMemo, useState } from "react";
import { getSales } from "./adminStore.js";

export default function AdminVentas() {
  const [sales, setSales] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    const data = getSales();
    setSales(Array.isArray(data) ? data : []);
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return sales;
    return sales.filter((s) => {
      const code = String(s.code || "").toLowerCase();
      const name = String(s.customer?.name || s.customerName || "").toLowerCase();
      const email = String(s.customer?.email || s.customerEmail || "").toLowerCase();
      return [code, name, email].some((x) => x.includes(term));
    });
  }, [sales, q]);

  const fmtDate = (iso) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleString("es-CL");
    } catch {
      return "—";
    }
  };

  return (
    <div>
      <div className="d-flex gap-2 align-items-center mb-3">
        <h5 className="m-0">Gestión de Ventas</h5>

        <div className="ms-auto d-flex gap-2">
          <input
            className="form-control"
            style={{ width: 280 }}
            placeholder="Buscar por código/cliente/correo..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Código</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Correo</th>
              <th>Estado</th>
              <th>Total</th>
              <th style={{ width: 260 }}>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => {
              const customerName = s.customer?.name || s.customerName || "—";
              const customerEmail = s.customer?.email || s.customerEmail || "—";
              const items = Array.isArray(s.items) ? s.items : [];
              const total = Number(s.total || 0);

              return (
                <tr key={s.code}>
                  <td className="fw-bold">{s.code}</td>
                  <td>{fmtDate(s.dateISO)}</td>
                  <td>{customerName}</td>
                  <td>{customerEmail}</td>
                  <td>
                    <span
                      className={`badge ${
                        s.status === "APROBADA" ? "text-bg-success" : "text-bg-danger"
                      }`}
                    >
                      {s.status || "—"}
                    </span>
                  </td>
                  <td>${total.toLocaleString("es-CL")}</td>

                  <td>
                    <details>
                      <summary className="text-primary" style={{ cursor: "pointer" }}>
                        Ver
                      </summary>

                      <div className="small mt-2">
                        <div className="text-muted">
                          <b>Items:</b> {items.length || s.itemsCount || 0}
                        </div>

                        {items.length > 0 ? (
                          <ul className="mb-0 mt-2">
                            {items.map((it) => (
                              <li key={it.id}>
                                {it.name} x{it.qty} — $
                                {Number(it.subtotal ?? it.price * it.qty).toLocaleString("es-CL")}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-muted mt-2">
                            (Esta venta fue guardada con formato antiguo sin detalle)
                          </div>
                        )}
                      </div>
                    </details>
                  </td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-muted py-4">
                  No hay ventas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="alert alert-secondary mt-3">
        <b>Tip:</b> Si tus ventas antiguas fueron guardadas antes del cambio, no tendrán detalle.
        Haz una compra aprobada nueva y verás cliente, fecha e items completos.
      </div>
    </div>
  );
}

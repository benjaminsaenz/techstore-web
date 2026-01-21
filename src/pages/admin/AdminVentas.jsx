import { useEffect, useMemo, useState } from "react";
import { getSales, saveSales } from "./adminStore.js";

const STATUS_OPTIONS = [
  "PENDIENTE",
  "APROBADA",
  "RECHAZADA",
  "ERROR_PAGO",
  "REVISION_MANUAL",
];

const badgeClass = (s) => {
  switch (String(s || "").toUpperCase()) {
    case "APROBADA":
      return "badge bg-success";
    case "RECHAZADA":
      return "badge bg-danger";
    case "ERROR_PAGO":
      return "badge bg-warning text-dark";
    case "REVISION_MANUAL":
      return "badge bg-info text-dark";
    default:
      return "badge bg-secondary";
  }
};

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleString("es-CL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso || "-";
  }
};

const formatCLP = (n) => `$${Number(n || 0).toLocaleString("es-CL")}`;

export default function AdminVentas() {
  const [sales, setSales] = useState([]);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);

  const refresh = () => setSales(getSales());

  useEffect(() => {
    refresh();

    // ✅ mismo tab (evento custom del checkout.js)
    const onSales = () => refresh();
    window.addEventListener("techstore:sales", onSales);

    // ✅ otra pestaña
    const onStorage = (e) => {
      if (e.key === "admin_sales_v1") refresh();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("techstore:sales", onSales);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

 const [hydrated, setHydrated] = useState(false);

useEffect(() => {
  setSales(getSales());
  setHydrated(true);
}, []);

useEffect(() => {
  if (!hydrated) return;
  saveSales(sales);
}, [sales, hydrated]);


  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return sales;

    return sales.filter((s) => {
      const hay = [
        s?.saleId,
        s?.code,
        s?.status,
        s?.customer?.name,
        s?.customer?.email,
        s?.dateISO,
        String(s?.total ?? ""),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(term);
    });
  }, [sales, q]);

  const updateStatus = (saleId, status) => {
    setSales((prev) => prev.map((s) => (s.saleId === saleId ? { ...s, status } : s)));
  };

  return (
    <div>
      <div className="d-flex gap-2 align-items-center mb-3">
        <h5 className="m-0">Gestión de Ventas</h5>

        <div className="ms-auto d-flex gap-2">
          <input
            className="form-control"
            style={{ width: 320 }}
            placeholder="Buscar venta..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th style={{ width: 140 }}>ID</th>
              <th style={{ width: 180 }}>Fecha</th>
              <th>Cliente</th>
              <th style={{ width: 220 }}>Correo</th>
              <th style={{ width: 120 }}>Total</th>
              <th style={{ width: 280 }}>Estado</th>
              <th style={{ width: 130 }}>Detalle</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((s) => (
              <tr key={s.saleId}>
                <td className="fw-bold">{s.saleId}</td>
                <td>{formatDate(s.dateISO)}</td>
                <td>{s.customer?.name || "Invitado"}</td>
                <td>{s.customer?.email || "—"}</td>
                <td className="fw-bold">{formatCLP(s.total)}</td>

                <td>
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className={badgeClass(s.status)}>{s.status || "PENDIENTE"}</span>

                    <select
                      className="form-select form-select-sm"
                      style={{ width: 170 }}
                      value={s.status || "PENDIENTE"}
                      onChange={(e) => updateStatus(s.saleId, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {s.reason ? (
                    <div className="small text-muted mt-1">
                      Motivo: <span className="fw-semibold">{s.reason}</span>
                    </div>
                  ) : null}
                </td>

                <td>
                  <button className="btn btn-sm btn-outline-primary" onClick={() => setSelected(s)} type="button">
                    Ver
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-muted py-4">
                  No hay ventas registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal detalle */}
      {selected && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,.5)" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalle {selected.saleId}</h5>
                <button className="btn-close" onClick={() => setSelected(null)} />
              </div>

              <div className="modal-body">
                <div className="row g-2">
                  <div className="col-md-6">
                    <div className="small text-muted">Cliente</div>
                    <div className="fw-bold">{selected.customer?.name}</div>
                  </div>

                  <div className="col-md-6">
                    <div className="small text-muted">Correo</div>
                    <div className="fw-bold">{selected.customer?.email}</div>
                  </div>

                  <div className="col-md-6 mt-2">
                    <div className="small text-muted">Fecha</div>
                    <div className="fw-bold">{formatDate(selected.dateISO)}</div>
                  </div>

                  <div className="col-md-6 mt-2">
                    <div className="small text-muted">Estado</div>
                    <div className="fw-bold">{selected.status}</div>
                  </div>

                  <div className="col-12 mt-3">
                    <div className="small text-muted mb-2">Items</div>

                    <div className="table-responsive">
                      <table className="table table-sm table-bordered align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Producto</th>
                            <th style={{ width: 110 }}>Precio</th>
                            <th style={{ width: 110 }}>Cantidad</th>
                            <th style={{ width: 130 }}>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(selected.items || []).map((it) => (
                            <tr key={it.id}>
                              <td className="fw-semibold">{it.name}</td>
                              <td>{formatCLP(it.price)}</td>
                              <td>{it.qty}</td>
                              <td>{formatCLP(it.subtotal)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="d-flex justify-content-end">
                      <div className="fw-bold fs-5">Total: {formatCLP(selected.total)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelected(null)} type="button">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

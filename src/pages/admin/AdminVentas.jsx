import { useEffect, useMemo, useState } from "react";
import { getSales } from "./adminStore.js";

export default function AdminVentas() {
  const [sales, setSales] = useState([]);

  useEffect(() => setSales(getSales()), []);

  const totalVentas = useMemo(
    () => sales.reduce((acc, s) => acc + (Number(s.total) || 0), 0),
    [sales]
  );

  return (
    <div>
      <div className="d-flex align-items-center mb-3">
        <h5 className="m-0">Gestión de Ventas</h5>
        <div className="ms-auto">
          <span className="badge bg-success fs-6">
            Total: ${totalVentas.toLocaleString("es-CL")}
          </span>
        </div>
      </div>

      {sales.length === 0 ? (
        <div className="alert alert-info">
          Aún no hay ventas registradas. (Luego conectamos “Finalizar compra” del carrito.)
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Items</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s) => (
                <tr key={s.id}>
                  <td>{new Date(s.createdAt).toLocaleString("es-CL")}</td>
                  <td>{s.clientEmail || "—"}</td>
                  <td>{(s.items || []).length}</td>
                  <td>${Number(s.total).toLocaleString("es-CL")}</td>
                  <td>
                    <span className={"badge " + (s.status === "aceptada" ? "bg-success" : "bg-warning text-dark")}>
                      {s.status || "pendiente"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { getClients, saveClients } from "./adminStore.js";

const emptyClient = {
  code: "",
  email: "",
  name: "",
  phone: "",
  address: "",
  region: "",
  city: "",
  comuna: "",
};

export default function AdminClientes() {
  // ✅ carga inicial inmediata (no depende de useEffect)
  const [clients, setClients] = useState(() => {
    const data = getClients();
    return Array.isArray(data) ? data : [];
  });

  // ✅ q existe (esto arregla tu error)
  const [q, setQ] = useState("");

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(emptyClient);

  // ✅ evita guardar antes de la primera carga
  const didLoad = useRef(false);

  useEffect(() => {
    didLoad.current = true;
  }, []);

  useEffect(() => {
    if (!didLoad.current) return;
    saveClients(clients);
  }, [clients]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return clients;
    return clients.filter((c) =>
      [c.code, c.email, c.name, c.address, c.city, c.comuna].some((x) =>
        String(x || "").toLowerCase().includes(term)
      )
    );
  }, [clients, q]);

  const nextCode = () => {
    const nums = clients
      .map((c) => parseInt(String(c.code || "").replace("C", ""), 10))
      .filter((n) => Number.isFinite(n));
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `C${String(next).padStart(3, "0")}`;
  };

  const startAdd = () => {
    setEditing(true);
    setForm({ ...emptyClient, code: nextCode() });
  };

  const startEdit = (c) => {
    setEditing(true);
    setForm({ ...c });
  };

  const cancel = () => {
    setEditing(false);
    setForm(emptyClient);
  };

  const remove = (code) => {
    if (!confirm("¿Eliminar cliente?")) return;
    setClients((prev) => prev.filter((c) => c.code !== code));
  };

  const submit = (e) => {
    e.preventDefault();

    if (!form.email.includes("@")) return alert("Correo inválido");
    if (form.name.trim().length < 3) return alert("Nombre muy corto");
    if (form.address.trim().length < 5) return alert("Dirección muy corta");

    setClients((prev) => {
      const exists = prev.some((c) => c.code === form.code);
      if (exists) return prev.map((c) => (c.code === form.code ? form : c));
      return [form, ...prev];
    });

    cancel();
  };

  return (
    <div>
      <div className="d-flex gap-2 align-items-center mb-3">
        <h5 className="m-0">Gestión de Clientes</h5>

        <div className="ms-auto d-flex gap-2">
          <input
            className="form-control"
            style={{ width: 280 }}
            placeholder="Buscar cliente..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="btn btn-primary" onClick={startAdd}>
            + Nuevo
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Cod</th>
              <th>Correo</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Región</th>
              <th>Comuna</th>
              <th style={{ width: 170 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.code}>
                <td className="fw-bold">{c.code}</td>
                <td>{c.email}</td>
                <td>{c.name}</td>
                <td>{c.phone}</td>
                <td>{c.address}</td>
                <td>{c.region}</td>
                <td>{c.comuna}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => startEdit(c)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => remove(c.code)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center text-muted py-4">
                  No hay clientes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="card mt-4">
          <div className="card-body">
            <div className="d-flex align-items-center">
              <h6 className="m-0">Formulario Cliente</h6>
              <button
                className="btn btn-sm btn-outline-secondary ms-auto"
                onClick={cancel}
              >
                Cerrar
              </button>
            </div>

            <form className="row g-3 mt-1" onSubmit={submit}>
              <div className="col-md-2">
                <label className="form-label">Código</label>
                <input className="form-control" value={form.code} disabled />
              </div>

              <div className="col-md-5">
                <label className="form-label">Correo</label>
                <input
                  className="form-control"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="col-md-5">
                <label className="form-label">Nombre</label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Teléfono</label>
                <input
                  className="form-control"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                />
              </div>

              <div className="col-md-9">
                <label className="form-label">Dirección</label>
                <input
                  className="form-control"
                  value={form.address}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, address: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Región</label>
                <input
                  className="form-control"
                  value={form.region}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, region: e.target.value }))
                  }
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Ciudad</label>
                <input
                  className="form-control"
                  value={form.city}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, city: e.target.value }))
                  }
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Comuna</label>
                <input
                  className="form-control"
                  value={form.comuna}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, comuna: e.target.value }))
                  }
                />
              </div>

              <div className="col-12 d-flex gap-2">
                <button className="btn btn-success" type="submit">
                  Guardar
                </button>
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={cancel}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

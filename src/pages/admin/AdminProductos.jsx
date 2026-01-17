import { useEffect, useMemo, useRef, useState } from "react";
import { getProducts, saveProducts } from "./adminStore.js";

const emptyProduct = {
  code: "",
  id: "",
  name: "",
  category: "",
  price: 0,
  stock: 0,
  image: "/img/",
  detail: "",
};

export default function AdminProductos() {
  // ✅ carga inmediata desde localStorage (sin esperar useEffect)
  const [products, setProducts] = useState(() => {
    const data = getProducts();
    return Array.isArray(data) ? data : [];
  });

  // ✅ ESTO arregla el error (q definido)
  const [q, setQ] = useState("");

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(emptyProduct);

  // ✅ evita guardar antes de cargar
  const didLoad = useRef(false);

  useEffect(() => {
    didLoad.current = true;
  }, []);

  useEffect(() => {
    if (!didLoad.current) return;
    saveProducts(products);
  }, [products]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return products;
    return products.filter((p) =>
      [p.code, p.name, p.category].some((x) =>
        String(x || "").toLowerCase().includes(term)
      )
    );
  }, [products, q]);

  const nextCode = () => {
    const nums = products
      .map((p) => parseInt(String(p.code || "").replace("P", ""), 10))
      .filter((n) => Number.isFinite(n));
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return `P${String(next).padStart(3, "0")}`;
  };

  const startAdd = () => {
    setEditing(true);
    setForm({ ...emptyProduct, code: nextCode(), id: `custom_${Date.now()}` });
  };

  const startEdit = (p) => {
    setEditing(true);
    setForm({ ...p });
  };

  const cancel = () => {
    setEditing(false);
    setForm(emptyProduct);
  };

  const remove = (code) => {
    if (!confirm("¿Eliminar producto?")) return;
    setProducts((prev) => prev.filter((p) => p.code !== code));
  };

  const submit = (e) => {
    e.preventDefault();

    if (form.name.trim().length < 3) return alert("Nombre muy corto");
    if (!form.category.trim()) return alert("Falta categoría");
    if (Number(form.price) <= 0) return alert("Precio inválido");
    if (Number(form.stock) < 0) return alert("Stock inválido");
    if (!String(form.image || "").startsWith("/img/"))
      return alert('La imagen debe comenzar con "/img/" (ej: /img/mouse.jpg)');

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    setProducts((prev) => {
      const exists = prev.some((p) => p.code === payload.code);
      if (exists) {
        return prev.map((p) => (p.code === payload.code ? payload : p));
      }
      return [payload, ...prev];
    });

    cancel();
  };

  return (
    <div>
      <div className="d-flex gap-2 align-items-center mb-3">
        <h5 className="m-0">Gestión de Productos</h5>

        <div className="ms-auto d-flex gap-2">
          <input
            className="form-control"
            style={{ width: 280 }}
            placeholder="Buscar producto..."
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
              <th style={{ width: 90 }}>Img</th>
              <th>Código</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th style={{ width: 220 }}>Detalle</th>
              <th style={{ width: 170 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.code}>
                <td>
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{ width: 64, height: 64, objectFit: "cover" }}
                    className="rounded border"
                  />
                </td>
                <td className="fw-bold">{p.code}</td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>${Number(p.price).toLocaleString("es-CL")}</td>
                <td>{p.stock}</td>
                <td>
                  <details>
                    <summary className="text-primary" style={{ cursor: "pointer" }}>
                      Ver
                    </summary>
                    <div className="small mt-2 text-muted">
                      {p.detail || "Sin detalle"}
                    </div>
                  </details>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => startEdit(p)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => remove(p.code)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center text-muted py-4">
                  No hay productos
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
              <h6 className="m-0">Formulario Producto</h6>
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

              <div className="col-md-4">
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

              <div className="col-md-2">
                <label className="form-label">Categoría</label>
                <input
                  className="form-control"
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">Precio</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  min={0}
                  required
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">Stock</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.stock}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, stock: e.target.value }))
                  }
                  min={0}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Imagen (ruta)</label>
                <input
                  className="form-control"
                  placeholder="/img/mouse.jpg"
                  value={form.image}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, image: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Detalle</label>
                <input
                  className="form-control"
                  value={form.detail}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, detail: e.target.value }))
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

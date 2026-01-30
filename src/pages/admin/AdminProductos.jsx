import { useEffect, useMemo, useState } from "react";
import NavbarAdmin from "../../components/NavbarAdmin.jsx";
import {
  adminCreateProduct,
  adminDeleteProduct,
  adminListProducts,
  adminUpdateProduct,
} from "../../api/productsApi.js";
import { isAdmin as isAdminSession } from "../AdminLogin.jsx";
import { useNavigate } from "react-router-dom";
import CKEditor4 from "../../components/admin/CKEditor4.jsx";

function emptyForm() {
  return {
    sku: "",
    name: "",
    category: "",
    price: 0,
    stock: 0,
    imageUrl: "",
    descriptionHtml: "",
    active: true,
  };
}

export default function AdminProductos() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState(null);
  const isEditing = editingId !== null;

  const canLoad = useMemo(() => isAdminSession(), []);

  async function load() {
    setError("");
    setLoading(true);
    try {
      const data = await adminListProducts();
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(
        e?.message ||
          "No se pudo cargar /api/admin/products. Revisa que el token esté puesto y el rol sea ADMIN."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!canLoad) {
      navigate("/admin-login");
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      sku: p.sku || "",
      name: p.name || "",
      category: p.category || "",
      price: Number(p.price ?? 0),
      stock: Number(p.stock ?? 0),
      imageUrl: p.imageUrl || "",
      descriptionHtml: p.descriptionHtml || p.description || "",
      active: Boolean(p.active ?? true),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm());
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // 🔒 CKEditor sometimes doesn't fire a final "change" before clicking Guardar.
    // Read the live editor HTML directly to avoid saving an empty description.
    const liveHtml =
      window.__techstoreCkEditors?.adminProductDesc?.getData?.() ?? form.descriptionHtml;

    const payload = {
      ...form,
      // Send multiple aliases so the backend can map regardless of naming strategy.
      descriptionHtml: liveHtml,
      description: liveHtml,
      description_html: liveHtml,
      price: Number(form.price),
      stock: Number(form.stock),
      active: Boolean(form.active),
    };

    try {
      if (isEditing) {
        await adminUpdateProduct(editingId, payload);
      } else {
        await adminCreateProduct(payload);
      }
      cancelEdit();
      await load();
    } catch (e2) {
      setError(e2?.message || "No se pudo guardar el producto");
    }
  };

  const remove = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    setError("");
    try {
      await adminDeleteProduct(id);
      await load();
    } catch (e) {
      setError(e?.message || "No se pudo eliminar");
    }
  };

  return (
    <>
      <NavbarAdmin />
      <div className="container admin-ui" style={{ padding: "20px" }}>

        <h2 style={{ marginBottom: 8 }}>Administrar productos (backend)</h2>
       

        {error && (
          <div
            style={{
              background: "#ffd7d7",
              padding: 12,
              borderRadius: 8,
              marginBottom: 12,
              whiteSpace: "pre-wrap",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={submit} style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input
              placeholder="SKU"
              value={form.sku}
              onChange={(e) => updateField("sku", e.target.value)}
              required
            />
            <input
              placeholder="Nombre"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input
              placeholder="Categoría"
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
            />
            <input
              placeholder="URL imagen"
              value={form.imageUrl}
              onChange={(e) => updateField("imageUrl", e.target.value)}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <input
              type="number"
              step="0.01"
              placeholder="Precio"
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
            />
            <input
              type="number"
              placeholder="Stock"
              value={form.stock}
              onChange={(e) => updateField("stock", e.target.value)}
            />
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={!!form.active}
                onChange={(e) => updateField("active", e.target.checked)}
              />
              Activo
            </label>
          </div>

          <div>
            <div style={{ marginBottom: 6, fontWeight: 600 }}>Descripción</div>
            <CKEditor4
              value={form.descriptionHtml}
              onChange={(html) => updateField("descriptionHtml", html)}
              instanceKey="adminProductDesc"
            />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit">{isEditing ? "Guardar cambios" : "Crear producto"}</button>
            {isEditing && (
              <button type="button" onClick={cancelEdit}>
                Cancelar
              </button>
            )}
            <button type="button" onClick={load}>
              Recargar
            </button>
          </div>
        </form>

        <hr style={{ margin: "20px 0" }} />

        {loading ? (
          <p>Cargando…</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {products.map((p) => (
              <div
                key={p.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: 10,
                  padding: 12,
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {p.name} <span style={{ opacity: 0.6 }}>({p.sku})</span>
                  </div>
                  <div style={{ opacity: 0.8, fontSize: 14 }}>
                    {p.category || "Sin categoría"} · ${Number(p.price ?? 0).toLocaleString()} · stock {p.stock ?? 0}
                    {p.active === false ? " · INACTIVO" : ""}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => startEdit(p)}>Editar</button>
                  <button onClick={() => remove(p.id)}>Eliminar</button>
                </div>
              </div>
            ))}
            {products.length === 0 && <p>No hay productos.</p>}
          </div>
        )}
      </div>
    </>
  );
}

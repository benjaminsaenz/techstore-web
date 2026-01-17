/**
 * checkout.js
 *
 * Utilidades de "pago" (simulado) SIN backend.
 * - Genera boletas (receipt)
 * - Guarda la última boleta en localStorage
 * - Registra ventas aprobadas en admin_sales_v1 para que aparezcan en AdminVentas
 *
 * IMPORTANTE: si tu login/registro guarda el usuario con otra key,
 * cambia USER_KEY a la que uses.
 */

const RECEIPT_KEY = "techstore_last_receipt_v1";
const SALES_KEY = "admin_sales_v1";
const USER_KEY = "techstore_user_v1";

export function getCustomerForReceipt() {
  // Si no hay usuario logueado, se muestra Invitado (no rompe la app).
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return { name: "Invitado", email: "—", address: "—" };
    const u = JSON.parse(raw);
    return {
      name: u.name || u.nombre || "Invitado",
      email: u.email || "—",
      address: u.address || u.direccion || "—",
    };
  } catch {
    return { name: "Invitado", email: "—", address: "—" };
  }
}

export function computeTotal(items) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((acc, it) => {
    const price = Number(it?.price);
    const qty = Number(it?.qty ?? 1);
    if (!Number.isFinite(price) || price <= 0) return acc;
    if (!Number.isFinite(qty) || qty <= 0) return acc;
    return acc + price * qty;
  }, 0);
}

export function createReceipt({ status, items, customerOverride }) {
  const customer = customerOverride || getCustomerForReceipt();
  const total = computeTotal(items);

  return {
    id: `TS-${Date.now()}`,
    dateISO: new Date().toISOString(),
    status, // "APROBADA" | "RECHAZADA"
    customer,
    items: (items || []).map((it) => ({
      id: it.id,
      name: it.name,
      price: Number(it.price),
      qty: Number(it.qty ?? 1),
      img: it.img || it.image || "",
    })),
    total,
  };
}

export function saveLastReceipt(receipt) {
  localStorage.setItem(RECEIPT_KEY, JSON.stringify(receipt));
}

export function getLastReceipt() {
  const raw = localStorage.getItem(RECEIPT_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearLastReceipt() {
  localStorage.removeItem(RECEIPT_KEY);
}

export function registerSaleIfApproved(receipt) {
  if (!receipt || receipt.status !== "APROBADA") return;

  const raw = localStorage.getItem(SALES_KEY);
  const sales = raw ? JSON.parse(raw) : [];

  sales.unshift({
    code: receipt.id,
    status: receipt.status,
    dateISO: receipt.dateISO, // ✅ fecha

    customer: {
      name: receipt.customer?.name || "Invitado",
      email: receipt.customer?.email || "—",
      address: receipt.customer?.address || "—",
    },

    items: (receipt.items || []).map((it) => ({
      id: it.id,
      name: it.name,
      price: Number(it.price),
      qty: Number(it.qty),
      subtotal: Number(it.price) * Number(it.qty),
    })),

    itemsCount: receipt.items?.length || 0,
    total: Number(receipt.total) || 0,
  });

  localStorage.setItem(SALES_KEY, JSON.stringify(sales));
}

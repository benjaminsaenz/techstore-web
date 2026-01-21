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

function readSalesSafe() {
  try {
    const raw = localStorage.getItem(SALES_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function nextSaleId(sales) {
  const nums = (sales || [])
    .map((s) => String(s.saleId || s.code || ""))
    .map((id) => {
      const m = id.match(/VEN-(\d+)/i);
      return m ? parseInt(m[1], 10) : NaN;
    })
    .filter((n) => Number.isFinite(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `VEN-${String(next).padStart(4, "0")}`;
}

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

// Guarda la venta en el panel admin (APROBADA o RECHAZADA)
export function registerSale(receipt) {
  if (!receipt) return;

  // ✅ Permite más estados (admin puede editar después)
  const status = String(receipt.status || "PENDIENTE").toUpperCase();

  const sales = readSalesSafe();
  const saleId = nextSaleId(sales);

  const items = (receipt.items || []).map((it) => {
    const price = Number(it.price);
    const qty = Number(it.qty ?? 1);
    return {
      id: it.id,
      name: it.name,
      price,
      qty,
      subtotal: Number.isFinite(price) && Number.isFinite(qty) ? price * qty : 0,
    };
  });

  sales.unshift({
    // ID "bonito" para el panel admin
    saleId, // VEN-0001
    code: saleId, // backward-compat

    // Referencia a la boleta
    receiptId: receipt.id,

    status, // APROBADA | RECHAZADA | PENDIENTE | ERROR PAGO | etc.
    dateISO: receipt.dateISO || new Date().toISOString(),

    reason: receipt.reason || "",

    customer: {
      name: receipt.customer?.name || "Invitado",
      email: receipt.customer?.email || "—",
      address: receipt.customer?.address || "—",
    },

    items,
    itemsCount: items.reduce((acc, it) => acc + (Number(it.qty) || 0), 0),
    total: Number(receipt.total) || 0,
  });

  localStorage.setItem(SALES_KEY, JSON.stringify(sales));

  // Notifica a la UI (mismo tab) que hubo cambios en ventas
  try { window.dispatchEvent(new Event("techstore:sales")); } catch {}
}

// Backward-compat (por si algún archivo antiguo lo está usando)
export function registerSaleIfApproved(receipt) {
  if (!receipt || receipt.status !== "APROBADA") return;
  registerSale(receipt);
}

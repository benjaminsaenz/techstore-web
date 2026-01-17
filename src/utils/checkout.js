const RECEIPT_KEY = "techstore_last_receipt_v1";
const SALES_KEY = "admin_sales_v1";
const USER_KEY = "techstore_user_v1"; // si tú guardas el usuario con otra key, dime y lo ajusto

export function getCustomerForReceipt() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      return { name: "Invitado", email: "—", address: "—" };
    }
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

export function createReceipt({ status, items }) {
  const customer = getCustomerForReceipt();
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
    })),
    total,
  };
}

export function saveLastReceipt(receipt) {
  localStorage.setItem(RECEIPT_KEY, JSON.stringify(receipt));
}

export function registerSaleIfApproved(receipt) {
  if (!receipt || receipt.status !== "APROBADA") return;

  const raw = localStorage.getItem(SALES_KEY);
  const sales = raw ? JSON.parse(raw) : [];

  sales.unshift({
    code: receipt.id,
    dateISO: receipt.dateISO,
    customerName: receipt.customer?.name || "Invitado",
    customerEmail: receipt.customer?.email || "—",
    total: receipt.total,
    itemsCount: receipt.items?.length || 0,
    status: receipt.status,
  });

  localStorage.setItem(SALES_KEY, JSON.stringify(sales));
}

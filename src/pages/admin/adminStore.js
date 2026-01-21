import { PRODUCTS } from "../../utils/products.js";

const LS_KEYS = {
  products: "admin_products_v1",
  clients: "admin_clients_v1",
  sales: "admin_sales_v1",
};

function safeParse(raw, fallback) {
  try {
    const v = raw ? JSON.parse(raw) : fallback;
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

function ensureArrayKey(key, fallbackArray) {
  const raw = localStorage.getItem(key);
  const parsed = safeParse(raw, null);
  if (!Array.isArray(parsed)) {
    localStorage.setItem(key, JSON.stringify(fallbackArray));
    return fallbackArray;
  }
  return parsed;
}

export function seedIfEmpty() {
  // ✅ Productos por defecto basados en tu catálogo real (utils/products.js)
  const defaultProducts = (PRODUCTS || []).map((p, idx) => ({
    code: `P${String(idx + 1).padStart(3, "0")}`,
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    stock: 10 + idx,
    image: p.img, // "/img/..."
    detail: (p.features || []).slice(0, 2).join(" • "),
  }));

  const defaultClients = [
    {
      code: "C001",
      email: "cliente1@email.cl",
      name: "Cliente Uno",
      phone: "+56 9 1111 1111",
      address: "Av. Siempre Viva 123",
      region: "RM",
      city: "Santiago",
      comuna: "Santiago",
    },
    {
      code: "C002",
      email: "cliente2@email.cl",
      name: "Cliente Dos",
      phone: "+56 9 2222 2222",
      address: "Los Carrera 456",
      region: "VIII",
      city: "Concepción",
      comuna: "Concepción",
    },
  ];

  // ✅ Products: si no existe o está vacío, sembrar catálogo
  const productsArr = ensureArrayKey(LS_KEYS.products, []);
  if (productsArr.length === 0) {
    localStorage.setItem(LS_KEYS.products, JSON.stringify(defaultProducts));
  }

  // ✅ Clients: si no existe o está vacío, sembrar clientes demo
  const clientsArr = ensureArrayKey(LS_KEYS.clients, []);
  if (clientsArr.length === 0) {
    localStorage.setItem(LS_KEYS.clients, JSON.stringify(defaultClients));
  }

  // ✅ Sales: JAMÁS borrar ventas existentes
  // Si no existe o está corrupto, se crea como array vacío.
  ensureArrayKey(LS_KEYS.sales, []);
}

function read(key) {
  return ensureArrayKey(key, []);
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---------- PRODUCTS ----------
export function getProducts() {
  return read(LS_KEYS.products);
}
export function saveProducts(products) {
  write(LS_KEYS.products, products);
}

// ---------- CLIENTS ----------
export function getClients() {
  return read(LS_KEYS.clients);
}
export function saveClients(clients) {
  write(LS_KEYS.clients, clients);
}

// ---------- SALES ----------
export function getSales() {
  return read(LS_KEYS.sales);
}
export function saveSales(sales) {
  write(LS_KEYS.sales, sales);
}
export function addSale(sale) {
  const sales = getSales();
  sales.unshift(sale);
  saveSales(sales);
}

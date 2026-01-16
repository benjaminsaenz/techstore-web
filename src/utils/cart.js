const KEY = "techstore_cart_v1";

export function getCart() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCart(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addToCart(product) {
  const items = getCart();
  const idx = items.findIndex((x) => x.id === product.id);
  if (idx >= 0) {
    items[idx].qty += 1;
  } else {
    items.push({ ...product, qty: 1 });
  }
  saveCart(items);
  return items;
}

export function clearCart() {
  saveCart([]);
}

export function cartCount() {
  return getCart().reduce((acc, it) => acc + (it.qty || 0), 0);
}

export function cartTotal() {
  return getCart().reduce((acc, it) => acc + (it.price * (it.qty || 0)), 0);
}

export function formatCLP(n) {
  return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(n);
}

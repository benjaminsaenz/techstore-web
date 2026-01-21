const KEY = "techstore_cart_v1";

// Emit a small global event so UI (Navbar badge, etc.) can react immediately
// when the cart changes, without needing a route change.
function notifyCartUpdated() {
  try {
    window.dispatchEvent(
      new CustomEvent("techstore:cart", {
        detail: { count: cartCount() },
      })
    );
  } catch {
    // no-op (tests / non-browser env)
  }
}

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
  notifyCartUpdated();
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

export function isValidPrice(price) {
  const n = Number(price);
  if (!Number.isFinite(n)) return false;
  return n > 0;
}

export function isValidStock(stock) {
  const n = Number(stock);
  if (!Number.isFinite(n)) return false;
  return n >= 0 && Number.isInteger(n);
}

export function isValidEmail(email) {
  if (typeof email !== "string") return false;
  const e = email.trim();
  if (e.length < 5) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export function computeCartTotal(items) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((acc, it) => {
    const price = Number(it?.price);
    const qty = Number(it?.qty);
    if (!Number.isFinite(price) || price < 0) return acc;
    if (!Number.isFinite(qty) || qty <= 0) return acc;
    return acc + price * qty;
  }, 0);
}

export function canCheckout(items) {
  return Array.isArray(items) && items.length > 0 && computeCartTotal(items) > 0;
}

import { apiFetch } from "./http";

// Public catalog (no token)
export async function fetchProducts() {
  return apiFetch("/api/products");
}

export async function fetchProductById(id) {
  return apiFetch(`/api/products/${id}`);
}

// Admin (requires token)
export async function adminListProducts() {
  return apiFetch("/api/admin/products", { auth: true });
}

export async function adminCreateProduct(product) {
  return apiFetch("/api/admin/products", { method: "POST", body: product, auth: true });
}

export async function adminUpdateProduct(id, product) {
  return apiFetch(`/api/admin/products/${id}`, { method: "PUT", body: product, auth: true });
}

export async function adminDeleteProduct(id) {
  return apiFetch(`/api/admin/products/${id}`, { method: "DELETE", auth: true });
}

// Small fetch helper with optional JWT support.

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function getToken() {
  return localStorage.getItem("techstore_token") || "";
}

export function setAuthSession({ token, role }) {
  if (token) localStorage.setItem("techstore_token", token);
  if (role) localStorage.setItem("techstore_role", role);
}

export function clearAuthSession() {
  localStorage.removeItem("techstore_token");
  localStorage.removeItem("techstore_role");
}

async function parseJsonSafe(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiFetch(path, { method = "GET", body, auth = false, headers = {} } = {}) {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  const finalHeaders = {
    Accept: "application/json",
    ...headers,
  };

  if (body !== undefined) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body !== undefined ? (typeof body === "string" ? body : JSON.stringify(body)) : undefined,

  });

  if (!res.ok) {
    const payload = await parseJsonSafe(res);
    const err = new Error(payload?.message || payload?.error || `HTTP ${res.status}`);
    err.status = res.status;
    err.payload = payload;
    throw err;
  }

  // 204 No Content
  if (res.status === 204) return null;

  return res.json();
}

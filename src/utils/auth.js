/**
 * auth.js (sin backend)
 * - Registro/Login usando localStorage
 * - Sesión activa (techstore_user_v1)
 * - Sincroniza clientes al storage del Admin (admin_clients_v1)
 */

const USERS_KEY = "techstore_users_v1";
const SESSION_KEY = "techstore_user_v1";
const ADMIN_CLIENTS_KEY = "admin_clients_v1";

// ✅ Usuario demo (login rápido)
// Se crea automáticamente si no existe en localStorage.
export const DEMO_CREDENTIALS = {
  email: "Cliente@techstore.cl",
  password: "Cliente123",
};

const DEMO_USER = {
  name: "Cliente Demo",
  email: DEMO_CREDENTIALS.email,
  password: DEMO_CREDENTIALS.password,
  address: "Av. Calle Falsa 123",
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ---------------------------------------------------------------------------
//  crea un usuario demo 
// ---------------------------------------------------------------------------
export function seedDemoUserIfMissing() {
  try {
    const users = readJSON(USERS_KEY, []);
    const exists = users.some((u) => String(u.email).toLowerCase() === DEMO_CREDENTIALS.email);
    if (!exists) {
      const demo = {
        id: `u_demo_${Date.now()}`,
        name: "Cliente Demo",
        email: DEMO_CREDENTIALS.email,
        password: DEMO_CREDENTIALS.password,
        address: "Av. Calle Falsa 123",
      };
      users.unshift(demo);
      writeJSON(USERS_KEY, users);

      // También lo agrega a Admin > Clientes (para que se vea en el panel)
      const clients = readJSON(ADMIN_CLIENTS_KEY, []);
      const alreadyClient = clients.some(
        (c) => String(c.email).toLowerCase() === DEMO_CREDENTIALS.email
      );
      if (!alreadyClient) {
        const nums = clients
          .map((c) => parseInt(String(c.code || "").replace("C", ""), 10))
          .filter((n) => Number.isFinite(n));
        const next = (nums.length ? Math.max(...nums) : 0) + 1;
        const code = `C${String(next).padStart(3, "0")}`;

        clients.unshift({
          code,
          email: demo.email,
          name: demo.name,
          phone: "",
          address: demo.address,
          region: "",
          city: "",
          comuna: "",
        });
        writeJSON(ADMIN_CLIENTS_KEY, clients);
      }
    }
  } catch {
    // si localStorage no está disponible, no hacemos nada
  }
}

export function getCurrentUser() {
  return readJSON(SESSION_KEY, null);
}

export function setCurrentUser(user) {
  writeJSON(SESSION_KEY, user);
  try {
    window.dispatchEvent(new CustomEvent("techstore:auth", { detail: { user } }));
  } catch {
    // ignore
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  try {
    window.dispatchEvent(new CustomEvent("techstore:auth", { detail: { user: null } }));
  } catch {
    // ignore
  }
}

export function getUsers() {
  const users = readJSON(USERS_KEY, []);
  return Array.isArray(users) ? users : [];
}

export function registerUser(newUser) {
  const users = getUsers();
  const email = String(newUser.email || "").trim().toLowerCase();
  if (!email) return { ok: false, error: "Correo inválido" };
  if (users.some((u) => String(u.email).toLowerCase() === email)) {
    return { ok: false, error: "Ese correo ya está registrado" };
  }

  const payload = {
    id: `u_${Date.now()}`,
    name: newUser.name,
    email,
    password: newUser.password,
    rut: newUser.rut,
    phone: newUser.phone,
    city: newUser.city,
    region: newUser.region,
    comuna: newUser.comuna,
    address: newUser.address,
  };

  users.unshift(payload);
  writeJSON(USERS_KEY, users);

  // ✅ también lo agregamos como "cliente" para el panel Admin
  syncUserToAdminClients(payload);

  // ✅ iniciar sesión automáticamente
  setCurrentUser({
    name: payload.name,
    email: payload.email,
    address: payload.address,
  });

  return { ok: true, user: payload };
}

export function login(email, password) {
  const users = getUsers();
  const e = String(email || "").trim().toLowerCase();
  const p = String(password || "").trim();
  const found = users.find((u) => String(u.email).toLowerCase() === e && String(u.password) === p);
  if (!found) return { ok: false, error: "Credenciales inválidas" };

  setCurrentUser({
    name: found.name,
    email: found.email,
    address: found.address,
  });
  return { ok: true, user: found };
}

function nextClientCode(existing) {
  const nums = existing
    .map((c) => parseInt(String(c.code || "").replace("C", ""), 10))
    .filter((n) => Number.isFinite(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `C${String(next).padStart(3, "0")}`;
}

export function syncUserToAdminClients(user) {
  const clients = readJSON(ADMIN_CLIENTS_KEY, []);
  const list = Array.isArray(clients) ? clients : [];

  const email = String(user.email || "").trim().toLowerCase();
  if (!email) return;

  const exists = list.some((c) => String(c.email || "").trim().toLowerCase() === email);
  if (exists) return;

  list.unshift({
    code: nextClientCode(list),
    email,
    name: user.name || "Cliente",
    phone: user.phone || "",
    address: user.address || "",
    region: user.region || "",
    city: user.city || "",
    comuna: user.comuna || "",
  });

  writeJSON(ADMIN_CLIENTS_KEY, list);
}

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { apiFetch, clearAuthSession } from "../api/http";

/**
 * AdminRoute
 * - Valida acceso al Admin consultando al backend (/api/admin/ping) con JWT.
 * - Si el token no existe o es inválido/no-admin => redirige a /admin-login.
 */
export default function AdminRoute({ children }) {
  const [allowed, setAllowed] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function run() {
      const token = localStorage.getItem("techstore_token");
      if (!token) return false;

      try {
        await apiFetch("/api/admin/ping", { auth: true });
        return true;
      } catch (e) {
        // 401/403 => sesión inválida
        clearAuthSession();
        return false;
      }
    }

    run().then((ok) => {
      if (mounted) setAllowed(ok);
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (allowed === null) return <div className="p-4">Validando acceso...</div>;
  if (!allowed) return <Navigate to="/admin-login" replace />;

  return children;
}

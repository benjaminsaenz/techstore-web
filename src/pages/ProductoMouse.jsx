import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarMain from "../components/NavbarMain.jsx";
import Footer from "../components/Footer.jsx";
import { useProducts } from "../hooks/useProducts.js";

/**
 * ProductoMouse (legacy)
 * - Antes existía una página fija "mouse" cuando la tienda era local.
 * - Ahora, como TODOS los productos vienen del backend, esta ruta sólo
 *   redirige al primer producto cuya categoría sea "mouse".
 */
export default function ProductoMouse() {
  const navigate = useNavigate();
  const { products, loading } = useProducts();

  useEffect(() => {
    if (loading) return;

    const firstMouse = (products || []).find(
      (p) => String(p.category || "").toLowerCase() === "mouse"
    );

    if (firstMouse?.id != null) {
      navigate(`/producto/${firstMouse.id}`, { replace: true });
    } else {
      navigate("/productos", { replace: true });
    }
  }, [loading, products, navigate]);

  return (
    <>
      <NavbarMain />
      <main className="container my-5">
        <div className="alert alert-info">Cargando detalle...</div>
      </main>
      <Footer />
    </>
  );
}

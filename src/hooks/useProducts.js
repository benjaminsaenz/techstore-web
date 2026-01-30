import { useEffect, useState } from "react";
import { fetchProducts } from "../api/productsApi.js";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const data = await fetchProducts();
        if (alive) setProducts(data);
      } catch (e) {
        if (alive) setError("No se pudo cargar el catálogo desde el backend");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return { products, loading, error };
}

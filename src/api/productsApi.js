import axios from "axios";

export async function fetchProducts() {
  const res = await axios.get("/data/products.json");
  return res.data?.products ?? [];
}

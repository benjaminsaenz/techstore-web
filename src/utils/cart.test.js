import { describe, it, expect, beforeEach } from "vitest";
import { addToCart, clearCart, getCart, cartCount, cartTotal } from "./cart.js";

describe("cart.js", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("inicia vacío si no hay datos", () => {
    expect(getCart()).toEqual([]);
  });

  it("agrega un producto con qty=1", () => {
    addToCart({ id: "p1", name: "Prod", price: 100, img: "/img/x.jpg" });
    const items = getCart();
    expect(items).toHaveLength(1);
    expect(items[0].qty).toBe(1);
  });

  it("si agregas el mismo producto incrementa qty", () => {
    addToCart({ id: "p1", name: "Prod", price: 100, img: "/img/x.jpg" });
    addToCart({ id: "p1", name: "Prod", price: 100, img: "/img/x.jpg" });
    const items = getCart();
    expect(items).toHaveLength(1);
    expect(items[0].qty).toBe(2);
  });

  it("calcula count y total correctamente", () => {
    addToCart({ id: "p1", name: "A", price: 100, img: "/img/a.jpg" });
    addToCart({ id: "p2", name: "B", price: 200, img: "/img/b.jpg" });
    addToCart({ id: "p2", name: "B", price: 200, img: "/img/b.jpg" });

    expect(cartCount()).toBe(3);
    expect(cartTotal()).toBe(500);
  });

  it("clearCart deja el carrito vacío", () => {
    addToCart({ id: "p1", name: "A", price: 100, img: "/img/a.jpg" });
    clearCart();
    expect(getCart()).toEqual([]);
  });
});

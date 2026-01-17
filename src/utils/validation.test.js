import { describe, it, expect } from "vitest";
import {
  isValidPrice,
  isValidStock,
  isValidEmail,
  computeCartTotal,
  canCheckout,
} from "./validation";

describe("validation", () => {
  // 1) precio negativo
  it("rechaza precio negativo", () => {
    expect(isValidPrice(-1000)).toBe(false);
  });

  // 2) precio cero
  it("rechaza precio cero", () => {
    expect(isValidPrice(0)).toBe(false);
  });

  // 3) precio positivo válido
  it("acepta precio positivo", () => {
    expect(isValidPrice(19990)).toBe(true);
  });

  // 4) precio no numérico
  it("rechaza precio no numérico", () => {
    expect(isValidPrice("abc")).toBe(false);
  });

  // 5) stock negativo
  it("rechaza stock negativo", () => {
    expect(isValidStock(-1)).toBe(false);
  });

  // 6) stock decimal (no entero)
  it("rechaza stock decimal", () => {
    expect(isValidStock(2.5)).toBe(false);
  });

  // 7) stock entero >= 0
  it("acepta stock entero >= 0", () => {
    expect(isValidStock(0)).toBe(true);
    expect(isValidStock(10)).toBe(true);
  });

  // 8) email inválido
  it("rechaza email inválido", () => {
    expect(isValidEmail("hola")).toBe(false);
    expect(isValidEmail("a@a")).toBe(false);
    expect(isValidEmail("test@dominio")).toBe(false);
  });

  // 9) email válido
  it("acepta email válido", () => {
    expect(isValidEmail("cliente@email.com")).toBe(true);
  });

  // 10) total carrito ignora items inválidos y checkout requiere total > 0
  it("calcula total del carrito y valida checkout", () => {
    const items = [
      { price: 1000, qty: 2 },   // 2000
      { price: -500, qty: 1 },   // inválido
      { price: 2000, qty: 0 },   // inválido
      { price: 3000, qty: 1 },   // 3000
    ];

    expect(computeCartTotal(items)).toBe(5000);
    expect(canCheckout(items)).toBe(true);

    expect(canCheckout([])).toBe(false);
    expect(canCheckout([{ price: 0, qty: 1 }])).toBe(false);
  });
});

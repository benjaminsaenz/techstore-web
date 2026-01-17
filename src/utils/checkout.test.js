import { describe, it, expect, beforeEach } from "vitest";
import { createReceipt, computeTotal, registerSaleIfApproved, saveLastReceipt, getLastReceipt } from "./checkout.js";

describe("checkout.js", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("computeTotal ignora precios <= 0", () => {
    const total = computeTotal([
      { price: -10, qty: 1 },
      { price: 0, qty: 1 },
      { price: 100, qty: 2 },
    ]);
    expect(total).toBe(200);
  });

  it("createReceipt genera estructura con total", () => {
    const receipt = createReceipt({
      status: "APROBADA",
      items: [{ id: "p1", name: "A", price: 100, qty: 3 }],
      customerOverride: { name: "Juan", email: "a@a.cl", address: "Calle 123" },
    });

    expect(receipt.status).toBe("APROBADA");
    expect(receipt.total).toBe(300);
    expect(receipt.customer.name).toBe("Juan");
    expect(receipt.items[0].qty).toBe(3);
  });

  it("saveLastReceipt y getLastReceipt funcionan", () => {
    const receipt = createReceipt({
      status: "RECHAZADA",
      items: [{ id: "p1", name: "A", price: 100, qty: 1 }],
      customerOverride: { name: "Invitado", email: "—", address: "—" },
    });
    saveLastReceipt(receipt);
    const read = getLastReceipt();
    expect(read.id).toBe(receipt.id);
  });

  it("registerSaleIfApproved registra venta solo si es APROBADA", () => {
    const ok = createReceipt({
      status: "APROBADA",
      items: [{ id: "p1", name: "A", price: 100, qty: 1 }],
      customerOverride: { name: "Juan", email: "a@a.cl", address: "Calle 123" },
    });

    const fail = createReceipt({
      status: "RECHAZADA",
      items: [{ id: "p1", name: "A", price: 100, qty: 1 }],
      customerOverride: { name: "Juan", email: "a@a.cl", address: "Calle 123" },
    });

    registerSaleIfApproved(fail);
    expect(JSON.parse(localStorage.getItem("admin_sales_v1") || "[]")).toHaveLength(0);

    registerSaleIfApproved(ok);
    const sales = JSON.parse(localStorage.getItem("admin_sales_v1") || "[]");
    expect(sales).toHaveLength(1);
    expect(sales[0].status).toBe("APROBADA");
  });
});

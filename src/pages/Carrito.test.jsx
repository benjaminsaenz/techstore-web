import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// Mock router navigate
const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../utils/cart.js", () => ({
  getCart: vi.fn(() => []),
  saveCart: vi.fn(),
  clearCart: vi.fn(),
  cartCount: vi.fn(() => 0),
  formatCLP: (n) => `CLP ${n}`,
}));

vi.mock("../utils/checkout.js", () => {
  return {
    createReceipt: vi.fn(() => ({ id: "TS-1", status: "APROBADA", items: [], total: 0, dateISO: new Date().toISOString(), customer: {} })),
    saveLastReceipt: vi.fn(),
    registerSaleIfApproved: vi.fn(),
  };
});

import Carrito from "./Carrito.jsx";
import { getCart, clearCart } from "../utils/cart.js";


describe("<Carrito />", () => {
  beforeEach(() => {
    navigateMock.mockClear();
    clearCart.mockClear();
  });

  it("muestra mensaje de carrito vacío", () => {
    getCart.mockReturnValueOnce([]);
    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );

    expect(screen.getByText(/Tu carrito está vacío/i)).toBeInTheDocument();
  });

  it("renderiza items y total", () => {
    getCart.mockReturnValueOnce([
      { id: "p1", name: "A", price: 100, qty: 2, img: "/img/a.jpg" },
      { id: "p2", name: "B", price: 50, qty: 1, img: "/img/b.jpg" },
    ]);

    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );

    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText(/Total:/i)).toBeInTheDocument();
  });

  it("al hacer click en compra aprobada navega a /pago-exitoso", () => {
    getCart.mockReturnValueOnce([{ id: "p1", name: "A", price: 100, qty: 1, img: "/img/a.jpg" }]);

    render(
      <MemoryRouter>
        <Carrito />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /Compra aprobada/i }));
    expect(clearCart).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith("/pago-exitoso");
  });
});

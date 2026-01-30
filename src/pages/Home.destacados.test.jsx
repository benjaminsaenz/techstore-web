import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home.jsx";

vi.mock("../hooks/useProducts.js", () => ({
  useProducts: () => ({
    loading: false,
    products: [
      {
        id: 1,
        name: "Teclado Gamer",
        category: "teclado",
        price: 1000,
        imageUrl: "/img/teclado1.jpg",
      },
    ],
  }),
}));

vi.mock("gsap", () => ({
  gsap: { registerPlugin: vi.fn(), from: vi.fn(), context: (fn) => (fn(), { revert: vi.fn() }) },
}));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: {} }));

describe("Home destacados", () => {
  it("renderiza al menos una imagen con alt correcto y src esperado", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const imgs = screen.getAllByAltText("Teclado Gamer");
    expect(imgs.length).toBeGreaterThan(0);

    // ✅ valida que al menos una tenga el src correcto
    expect(imgs.some((img) => (img.getAttribute("src") || "").includes("/img/teclado1.jpg"))).toBe(true);
  });
});


import "@testing-library/jest-dom/vitest";

import "@testing-library/jest-dom/vitest";

if (!window.localStorage || typeof window.localStorage.clear !== "function") {
  let store = {};
  window.localStorage = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => (store[k] = String(v)),
    removeItem: (k) => delete store[k],
    clear: () => (store = {}),
  };
}


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setupTests.js"],
    // Si luego quieres cobertura:
    // coverage: { provider: "v8", reporter: ["text", "html"] },
  },
});

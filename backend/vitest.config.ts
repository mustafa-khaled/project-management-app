import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./src/__tests__/setup.ts"],
    coverage: {
      reporter: ["text", "json", "html"],
    },
    include: ["src/**/*.test.ts", "src/__tests__/**/*.test.ts"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/setup.ts"],
  },
});

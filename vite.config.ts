// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro, etc.
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.

import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    // Wrangler requires a plugins array to exist
    plugins: [],
    // Use native tsconfig path resolution instead of vite-tsconfig-paths plugin
    resolve: {
      tsconfigPaths: true,
    },
    // Optional: silence large bundle warnings
    build: {
      chunkSizeWarningLimit: 2000,
    },
  },
});

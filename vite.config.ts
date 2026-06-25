// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro, etc.
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.

import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    // Wrangler requires a plugins array to exist.
    plugins: [],
    // Replace vite-tsconfig-paths plugin with native support
    resolve: {
      tsconfigPaths: true,
    },
    // Optional: adjust chunk size warning limit if needed
    build: {
      chunkSizeWarningLimit: 2000,
    },
  },
});

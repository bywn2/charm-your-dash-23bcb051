// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro, etc.
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.

import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  // Wrangler requires a plugins array to exist.
  // Even if @lovable.dev injects plugins internally, we expose an empty array here.
  vite: {
    plugins: [],
    resolve: {
      tsconfigPaths: true, // replaces vite-tsconfig-paths plugin
    },
  },
});

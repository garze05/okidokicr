// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  server: {
    proxy: { '/api': 'http://localhost:4000' }
  },
  integrations: [icon(), react()],
  vite: {
    plugins: [tailwindcss()],
  }
});
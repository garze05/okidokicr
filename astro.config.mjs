// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:4000"
    }
  },
  integrations: [
    icon(),
  ],
  vite: {
    plugins: [tailwindcss()],
  }
});

import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import react from "@astrojs/react";

import netlify from "@astrojs/netlify";

export default defineConfig({
  server: {
    proxy: { '/api': 'http://localhost:4000' },
  },

  integrations: [icon(), react()],

  vite: {
    plugins: [tailwindcss()],
  },

  site: "https://okidokicr.com",
  adapter: netlify(),
});
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import react from "@astrojs/react";

import netlify from "@astrojs/netlify";

import sitemap from "@astrojs/sitemap";

import robotsTxt from "astro-robots-txt";

export default defineConfig({
  alias: {
    "@components": "./src/components",
    "@layouts": "./src/layouts",
    "@pages": "./src/pages",
    "@data": "./src/data",
    "@images": "./src/images",
    "@styles": "./src/styles",
    "@utils": "./src/utils",
  },
  integrations: [icon(), react(), sitemap(), robotsTxt()],

  vite: {
    plugins: [tailwindcss()],
  },

  site: "https://okidokicr.com",
  adapter: netlify(),
});

import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import icon from "astro-icon";
import react from "@astrojs/react";

import netlify from "@astrojs/netlify";

import sitemap from "@astrojs/sitemap";

import robotsTxt from "astro-robots-txt";

const excludedFromSitemap = ["/admin/"];

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
  integrations: [
    icon(),
    react(),
    sitemap({
      // Exclude pages from the sitemap
      // extract only the route with new URL(page).pathname (e.g /admin/login),
      // then verifies if it starts with any of the excluded paths
      filter: (page) => {
        const pathname = new URL(page).pathname;
        return !excludedFromSitemap.some((excludedPath) =>
          pathname.startsWith(excludedPath),
        );
      },
    }),
    robotsTxt(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  site: "https://okidokicr.com",
  adapter: netlify(),
});

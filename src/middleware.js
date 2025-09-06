// src/middleware.ts
import { defineMiddleware } from "astro/middleware";
const MAINTENANCE = import.meta.env.PUBLIC_MAINTENANCE_MODE === "true";

export const onRequest = defineMiddleware(async (ctx, next) => {
  // Permite estáticos/health
  const url = new URL(ctx.request.url);
  const allow =
    url.pathname.startsWith("/images") ||
    url.pathname.startsWith("/favicon") ||
    url.pathname === "/health";

  if (!MAINTENANCE || allow) {
    return next();
  }

  const html = `
    <!doctype html><html lang="es"><head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <meta name="robots" content="noindex,nofollow,noarchive"/>
      <title>OkiDoki - Mantenimiento</title>
      <style>
        body{font-family:system-ui,-apple-system,Segoe UI,Roboto;display:grid;place-items:center;height:100dvh;margin:0}
        .box{max-width:680px;padding:24px;text-align:center}
      </style>
    </head><body>
      <div class="box">
        <img src="src/images/ranawip.png" height="150px" alt="Logo OkiDoki Costa Rica Mantenimiento"/>
        <h1>Volvemos en un ratito 🚧🐸</h1>
        <p>Estamos haciendo mantenimiento para mejorar tu experiencia.</p>
      </div>
    </body></html>
  `.trim();

  return new Response(html, {
    status: 503,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Retry-After": "3600", // 1 hora
      "Cache-Control": "no-store, max-age=0",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });
});

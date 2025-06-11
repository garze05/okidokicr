import app from "./app.js";
import { db } from "./lib/db.js";

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}/`);
});

// Graceful shutdown
const shutdown = async () => {
  console.log("Apagando servidor...");
  await db.$disconnect();
  server.close(() => {
    console.log("Servidor cerrado correctamente.");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("beforeExit", shutdown);

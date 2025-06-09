import express from "express";
import dotenv from "dotenv";

// Montar rutas
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js"; // Tiene que estar antes de las rutas de servicios
import tagRoutes from "./routes/tagRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";

dotenv.config(); // Siempre al principio

import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
// Configuración de Cloudinary
cloudinary.config();
// Para poder recibir JSON
app.use(express.json());

// Cuales frontends pueden hacer peticiones a la API
const whitelist = ["https://okidokicr.com", "http://localhost:4321"];

// Configuración de CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir llamadas desde Postman o curl (sin origin)
      if (!origin || whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS no permitido"));
      }
    },
    credentials: true, // Si se llegaran a usar cookies
  }),
);

// Rutas públicas
app.use("/api/auth", authRoutes);

app.get("/api/test", (req, res) => {
  res.json({ msg: "La api funciona" });
});

// Endpoint para subir fotos/videos
app.use("/api/upload", uploadRoutes);
// Deben ir después de la ruta de upload
app.use("/api/tags", tagRoutes);
app.use("/api/services", serviceRoutes);

// Middleware de manejo de errores simple
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Algo falló en el servidor" });
});

export default app;

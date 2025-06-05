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

// Permitir peticiones desde frontend en 4321
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Incoming request from origin:", origin); // Debug log

      // Allow requests with no origin
      if (!origin) return callback(null, true);

      // Allow localhost and production origins
      const allowedOrigins = [
        "https://okidokicr.com", // Removed trailing slash
        "https://okidokicr.com:3000",
        "https://okidokicr.com:4000",
        process.env.FRONTEND_URL,
        // Add mobile-friendly variations
        "http://192.168.1.11:4321", // Direct IP access
        "capacitor://localhost", // For Capacitor/Ionic apps
        "ionic://localhost", // For older Ionic apps
      ].filter(Boolean);

      // More flexible matching for development
      const isDev =
        process.env.MODE === "development" ||
        process.env.NODE_ENV === "development";

      if (isDev) {
        console.log("Development mode: CORS allowed");
        return callback(null, true);
      }

      // Check if origin is in allowed list
      if (allowedOrigins.indexOf(origin) !== -1) {
        console.log(`CORS request from ${origin} allowed`);
        callback(null, true);
      } else {
        console.log(`CORS request from ${origin} denied`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow credentials (cookies, etc.)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Rutas públicas
app.use("/api/auth", authRoutes);

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

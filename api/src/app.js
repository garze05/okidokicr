import express from 'express'
import dotenv from 'dotenv'

// Montar rutas
import authRoutes from './routes/authRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js' // Tiene que estar antes de las rutas de servicios
import tagRoutes from './routes/tagRoutes.js'
import serviceRoutes from './routes/serviceRoutes.js'

dotenv.config() // Siempre al principio

import cors from 'cors'
import { v2 as cloudinary } from 'cloudinary'
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express()
// Configuración de Cloudinary
cloudinary.config()
// Para poder recibir JSON
app.use(express.json())


// Permitir peticiones desde frontend en 4321
app.use(cors({
  origin: 'http://localhost:4321',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.get('/api/ping', (req, res) => {
  console.log('🔥 Ping recibido en backend')
  res.send('pong')
})



// Rutas públicas
app.use('/api/auth', authRoutes)

// Endpoint para subir fotos/videos
app.use('/api/upload', uploadRoutes)
// Deben ir después de la ruta de upload
app.use('/api/tags', tagRoutes)
app.use('/api/services', serviceRoutes)

// Middleware de manejo de errores simple
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Algo falló en el servidor' })
})

export default app
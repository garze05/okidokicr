import express from 'express'
import dotenv from 'dotenv'

// Montar rutas
import tagRoutes from './routes/tagRoutes.js'
import serviceRoutes from './routes/serviceRoutes.js'

dotenv.config()

const app = express()
app.use(express.json())

// Rutas
app.use('/api/tags', tagRoutes)
app.use('/api/services', serviceRoutes)

// Middleware de manejo de errores simple
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Algo falló en el servidor' })
})

export default app

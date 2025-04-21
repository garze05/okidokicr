import { Router } from 'express'
import { uploadMedia } from '../controllers/uploadController.js'
import { authenticate } from '../middlewares/authMiddleware.js'
import multer from 'multer'

// Configuramos multer para almacenar en memoria
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // límite 10MB
})

const router = Router()

// Recibe un solo archivo en el campo "file"
router.post('/', upload.single('file'), uploadMedia)
// Solo admins pueden subir archivos
router.post('/', authenticate, upload.single('file'), uploadMedia)

export default router
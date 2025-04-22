import { Router } from 'express'
import { authenticate } from '../middlewares/authMiddleware.js'
import { uploadMedia } from '../controllers/uploadController.js'
import multer from 'multer'

// Multer en memoria con límite 100 MB
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100 MB
})

const router = Router()

// QUITAMOS la ruta duplicada y ponemos AUTH primero
router.post(
  '/',
  authenticate,
  upload.single('file'),
  uploadMedia
)

export default router

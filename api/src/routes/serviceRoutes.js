import { Router } from 'express'
import {
  createService,
  listServices,
  getService,
  updateService,
  deleteService,
  countMedia,
  addImages,
  addVideos,
  toggleAvailability
} from '../controllers/serviceController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = Router()

router.post('/', authenticate, createService)       // Crear nuevo servicio
router.put('/:id', authenticate, updateService)     // Actualizar
router.delete('/:id', authenticate, deleteService)  // Borrar


router.post('/:id/images', authenticate, addImages) // Agregar imagenes
router.post('/:id/videos', authenticate, addVideos) // Agregar videos
router.put('/:id/toggle-availability', authenticate, toggleAvailability) // Cambiar disponibilidad

// Publicos
router.get('/', listServices)         // Listar todos
router.get('/:id', getService)        // Obtener uno por id
router.get('/:id/media-count', countMedia) // Contar imagenes y videos

export default router

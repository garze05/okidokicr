import { Router } from 'express'
import {
  createService,
  listServices,
  getService,
  updateService,
  deleteService
} from '../controllers/serviceController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = Router()

router.post('/', authenticate, createService)       // Crear nuevo servicio
router.put('/:id', authenticate, updateService)     // Actualizar
router.delete('/:id', authenticate, deleteService)  // Borrar

// Publicos
router.get('/', listServices)         // Listar todos
router.get('/:id', getService)        // Obtener uno por id

export default router

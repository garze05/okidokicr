import { Router } from 'express'
import {
  createService,
  listServices,
  getService,
  updateService,
  deleteService
} from '../controllers/serviceController.js'

const router = Router()

router.post('/', createService)       // Crear nuevo servicio
router.get('/', listServices)         // Listar todos
router.get('/:id', getService)        // Obtener uno por id
router.put('/:id', updateService)     // Actualizar
router.delete('/:id', deleteService)  // Borrar

export default router

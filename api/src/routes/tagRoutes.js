import { Router } from 'express'
import {
  createTag,
  listTags,
  updateTag,
  deleteTag
} from '../controllers/tagController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = Router()

router.post('/', authenticate, createTag)      // Crear
router.put('/:id',  authenticate, updateTag)    // Actualizar
router.delete('/:id',  authenticate, deleteTag) // Borrar

// Publicos
router.get('/', listTags)        // Leer todos


export default router

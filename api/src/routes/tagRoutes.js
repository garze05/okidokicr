import { Router } from 'express'
import {
  createTag,
  listTags,
  updateTag,
  deleteTag
} from '../controllers/tagController.js'

const router = Router()

router.post('/', createTag)      // Crear
router.get('/', listTags)        // Leer todos
router.put('/:id', updateTag)    // Actualizar
router.delete('/:id', deleteTag) // Borrar

export default router

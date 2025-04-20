import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Crear un tag
export const createTag = async (req, res, next) => {
  try {
    const { name } = req.body
    const slug = name.toLowerCase().replace(/\s+/g, '-')
    const tag = await prisma.tag.create({ data: { name, slug } })
    res.status(201).json(tag)
  } catch (err) {
    next(err)
  }
}

// Listar todos los tags
export const listTags = async (req, res, next) => {
  try {
    const tags = await prisma.tag.findMany()
    res.json(tags)
  } catch (err) {
    next(err)
  }
}

// Actualizar un tag
export const updateTag = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name } = req.body
    const slug = name.toLowerCase().replace(/\s+/g, '-')
    const tag = await prisma.tag.update({
      where: { id: Number(id) },
      data: { name, slug }
    })
    res.json(tag)
  } catch (err) {
    next(err)
  }
}

// Borrar un tag
export const deleteTag = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.tag.delete({ where: { id: Number(id) } })
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}

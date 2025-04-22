import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// Crear servicio
export const createService = async (req, res, next) => {
  try {
    const {
      title,
      description,
      coverImage,
      gallery = [],    // array de URLs
      videos = [],     // array de URLs
      tagIds = [],      // array de ids de tags
      available
    } = req.body

    const service = await prisma.service.create({
      data: {
        title,
        description,
        coverImage,
        available,
        // insertamos cada URL en la tabla GalleryImage
        gallery: {
          create: gallery.map(url => ({ url }))
        },
        // igual con videos
        videos: {
          create: videos.map(url => ({ url }))
        },
        // relaciones a tags
        tags: {
          create: tagIds.map(tagId => ({ tagId }))
        }
      },
      include: {
        gallery: true,
        videos: true,
        tags: { include: { tag: true } }
      }
    })

    res.status(201).json(service)
  } catch (err) {
    next(err)
  }
}

// Listar todos los servicios
export const listServices = async (req, res, next) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        gallery: true,
        videos: true,
        tags: { include: { tag: true } }
      }
    })
    res.json(services)
  } catch (err) {
    next(err)
  }
}

// Listar numero de imagenes en servicio
export const countImages = async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const count = await prisma.galleryImage.count({ where: { serviceId: id } })
    res.json({ count })
  } catch (err) {
    next(err)
  }
}

// Listar numero de videos en servicio
export const countVideos = async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const count = await prisma.video.count({ where: { serviceId: id } })
    res.json({ count })
  } catch (err) {
    next(err)
  }
}


// Obtener un servicio por ID
export const getService = async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        gallery: true,
        videos: true,
        tags: { include: { tag: true } }
      }
    })
    if (!service) return res.status(404).json({ error: 'Servicio no encontrado' })
    res.json(service)
  } catch (err) {
    next(err)
  }
}

// Actualizar servicio (reemplaza multimedia y tags)
export const updateService = async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const {
      title,
      description,
      coverImage,
      gallery = [],
      videos = [],
      tagIds = [],
      available
    } = req.body

    // Primero, borramos galerías, videos y tags previos
    await prisma.galleryImage.deleteMany({ where: { serviceId: id } })
    await prisma.video.deleteMany({ where: { serviceId: id } })
    await prisma.serviceTag.deleteMany({ where: { serviceId: id } })

    // Luego actualizamos el servicio y reinsertamos relaciones
    const service = await prisma.service.update({
      where: { id },
      data: {
        title,
        description,
        coverImage,
        available,
        gallery: { create: gallery.map(url => ({ url })) },
        videos:  { create: videos.map(url => ({ url })) },
        tags:    { create: tagIds.map(tagId => ({ tagId })) }
      },
      include: {
        gallery: true,
        videos: true,
        tags: { include: { tag: true } }
      }
    })

    res.json(service)
  } catch (err) {
    next(err)
  }
}

// Borrar servicio
export const deleteService = async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    await prisma.service.delete({ where: { id } })
    res.status(204).end()
  } catch (err) {
    next(err)
  }
}

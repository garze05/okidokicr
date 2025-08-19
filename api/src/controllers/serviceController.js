import { db } from "../lib/db.js";

// GENERALES
// Crear servicio - Fixed service overwrite bug
export const createService = async (req, res, next) => {
  try {
    const {
      title,
      description,
      coverImage,
      gallery = [], // array de URLs
      videos = [], // array de URLs
      tagIds = [], // array de ids de tags
      available,
    } = req.body;

    const service = await db.service.create({
      data: {
        title,
        description,
        coverImage,
        available,
        // insertamos cada URL en la tabla GalleryImage
        gallery: {
          create: gallery.map((url) => ({ url })),
        },
        // igual con videos
        videos: {
          create: videos.map((url) => ({ url })),
        },
        // relaciones a tags
        tags: {
          create: tagIds.map((tagId) => ({ tagId })),
        },
      },
      include: {
        gallery: true,
        videos: true,
        tags: { include: { tag: true } },
      },
    });

    res.status(201).json(service);
  } catch (err) {
    next(err);
  }
};

// Listar todos los servicios
export const listServices = async (req, res, next) => {
  try {
    const services = await db.service.findMany({
      include: {
        _count: {
          select: {
            gallery: true,
            videos: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    res.json(services);
  } catch (err) {
    next(err);
  }
};

// Obtener un servicio por ID
export const getService = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const service = await db.service.findUnique({
      where: { id },
      include: {
        gallery: true,
        videos: true,
        tags: { include: { tag: true } },
      },
    });
    if (!service)
      return res.status(404).json({ error: "Servicio no encontrado" });
    res.json(service);
  } catch (err) {
    next(err);
  }
};

// Actualizar servicio (reemplaza multimedia y tags)
export const updateService = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const {
      title,
      description,
      coverImage,
      gallery = [],
      videos = [],
      tagIds = [],
      available,
    } = req.body;

    // Validate that required data exists before making any changes
    if (!title || !description) {
      return res.status(400).json({ 
        error: "Título y descripción son obligatorios" 
      });
    }

    // Verify service exists before updating
    const existingService = await db.service.findUnique({ 
      where: { id },
      include: {
        gallery: true,
        videos: true,
        tags: { include: { tag: true } },
      }
    });
    
    if (!existingService) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }

    // Use transaction to ensure atomicity
    const service = await db.$transaction(async (prisma) => {
      // Update basic service info first
      const updatedService = await prisma.service.update({
        where: { id },
        data: {
          title,
          description,
          coverImage,
          available,
        },
      });

      // Only update media if arrays are provided and not empty
      if (Array.isArray(gallery)) {
        // Delete existing gallery images
        await prisma.galleryImage.deleteMany({ where: { serviceId: id } });
        // Add new gallery images if any
        if (gallery.length > 0) {
          await prisma.galleryImage.createMany({
            data: gallery.map((url) => ({ url, serviceId: id })),
            skipDuplicates: true,
          });
        }
      }

      if (Array.isArray(videos)) {
        // Delete existing videos
        await prisma.video.deleteMany({ where: { serviceId: id } });
        // Add new videos if any
        if (videos.length > 0) {
          await prisma.video.createMany({
            data: videos.map((url) => ({ url, serviceId: id })),
            skipDuplicates: true,
          });
        }
      }

      if (Array.isArray(tagIds)) {
        // Delete existing tag relationships
        await prisma.serviceTag.deleteMany({ where: { serviceId: id } });
        // Add new tag relationships if any
        if (tagIds.length > 0) {
          await prisma.serviceTag.createMany({
            data: tagIds.map((tagId) => ({ serviceId: id, tagId })),
            skipDuplicates: true,
          });
        }
      }

      // Return the complete updated service
      return await prisma.service.findUnique({
        where: { id },
        include: {
          gallery: true,
          videos: true,
          tags: { include: { tag: true } },
        },
      });
    });

    res.json(service);
  } catch (err) {
    console.error('Error updating service:', err);
    next(err);
  }
};

// Borrar servicio
export const deleteService = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    // 1. Eliminar imágenes relacionadas
    await db.galleryImage.deleteMany({ where: { serviceId: id } });

    // 2. Eliminar videos relacionados
    await db.video.deleteMany({ where: { serviceId: id } });

    // 3. Eliminar relaciones de tags
    await db.serviceTag.deleteMany({ where: { serviceId: id } });

    // 4. Finalmente, eliminar el servicio
    await db.service.delete({ where: { id } });

    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

// ESPECIFICAS
// Listar numero de imagenes y videos en servicio
export const countMedia = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const service = await db.service.findUnique({
      where: { id },
      select: {
        gallery: { select: { id: true } },
        videos: { select: { id: true } },
      },
    });
    if (!service)
      return res.status(404).json({ error: "Servicio no encontrado" });
    res.json({
      totalImages: service.gallery.length,
      totalVideos: service.videos.length,
    });
  } catch (err) {
    next(err);
  }
};

// Agregar imagenes a servicio
export const addImages = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { urls } = req.body; // Ahora esperamos un array de URLs

    const images = await db.galleryImage.createMany({
      data: urls.map((url) => ({ url, serviceId: id })),
      skipDuplicates: true,
    });

    res.status(201).json({ count: images.count });
  } catch (err) {
    next(err);
  }
};

// Agregar videos a servicio
export const addVideos = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { urls } = req.body; // Ahora esperamos un array de URLs

    const videos = await db.video.createMany({
      data: urls.map((url) => ({ url, serviceId: id })),
      skipDuplicates: true,
    });

    res.status(201).json({ count: videos.count });
  } catch (err) {
    next(err);
  }
};

// Cambiar disponibilidad de servicio
export const toggleAvailability = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const service = await db.service.findUnique({ where: { id } });
    if (!service)
      return res.status(404).json({ error: "Servicio no encontrado" });

    const updatedService = await db.service.update({
      where: { id },
      data: { available: !service.available },
    });

    res.json(updatedService);
  } catch (err) {
    next(err);
  }
};

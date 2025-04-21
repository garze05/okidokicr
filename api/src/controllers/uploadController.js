import { v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'

export const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' })
    }

    // Función auxiliar para subir buffer
    const uploadStream = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'okidoki_media' },
          (error, result) => {
            if (error) return reject(error)
            resolve(result)
          }
        )
        streamifier.createReadStream(req.file.buffer).pipe(stream)
      })

    const result = await uploadStream()
    // Devuelve la URL pública y, si quieres, el public_id
    res.json({ url: result.secure_url, public_id: result.public_id })
  } catch (err) {
    next(err)
  }
}

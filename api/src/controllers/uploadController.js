import { v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'

// Promise que sube cualquier tamaño en chunks
const uploadStream = (buffer) =>
  new Promise((resolve, reject) => {
    const options = {
      folder: 'okidoki_media',
      resource_type: 'auto',
      chunk_size: 6000000,        // 6 MB por chunk
    }
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => error ? reject(error) : resolve(result)
    )
    streamifier.createReadStream(buffer).pipe(stream)
  })

export const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' })
    }

    // buffer + meta
    const { buffer } = req.file

    // sube en chunks
    const result = await uploadStream(buffer)

    res.json({ url: result.secure_url, public_id: result.public_id })
  } catch (err) {
    next(err)
  }
}

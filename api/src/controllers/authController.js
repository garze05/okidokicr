import jwt from 'jsonwebtoken'

export const login = (req, res, next) => {
  try {

    const { user, password } = req.body

    if (user === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD) {
      const payload = { user, role: 'ADMIN' }
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
      })
      return res.json({ token })
    }

    return res.status(401).json({ error: 'Credenciales inválidas' })
  } catch (err) {
    console.error('❌ Error en login:', err)
    next(err)
  }
}

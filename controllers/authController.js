// auth.controller.js
const pool = require('../db');
const jwt  = require('jsonwebtoken');

// Lee tu secret desde variables de entorno
const JWT_SECRET = process.env.JWT_SECRET;
exports.loginEmpleado = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar usuario activo por email
    const result = await pool.query(
      'SELECT * FROM Empleados WHERE email = $1 AND activo = TRUE',
      [email]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    // 2. Verificar contraseña (en producción usá bcrypt.compare)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // 3. Generar el token con un payload mínimo
    const payload = {
      sub: user.id,
      email: user.email,
      nombre: user.nombre
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });

    // 4. Devolver token y datos públicos del usuario
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email
      }
    });

  } catch (err) {
    console.error('Error en loginEmpleado:', err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

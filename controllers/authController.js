// auth.controller.js
const pool = require('../db');
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // o bcryptjs si lo prefieres

// Lee tu secret desde variables de entorno
const JWT_SECRET = process.env.JWT_SECRET;

exports.loginEmpleado = async (req, res) => {
  const { email, password } = req.body;

  // Validación de campos
  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM Empleados WHERE email = $1 AND activo = TRUE',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    // Comparar la contraseña con bcrypt
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const payload = {
      sub: user.id,
      email: user.email,
      nombre: user.nombre
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });

    return res
      .cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 2 * 60 * 60 * 1000
      })
      .status(200)
      .json({
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

exports.registerEmpleado = async (req, res) => {
  const { nombre, email, password } = req.body;

  // Validación de campos
  if (!nombre || !email || !password) {
    return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos' });
  }

  try {
    const existingUser = await pool.query(
      'SELECT * FROM Empleados WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO Empleados (nombre, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, nombre, email;`,
      [nombre, email, hashed]
    );
    
    const user = result.rows[0];
    const token = jwt.sign(
      { sub: user.id, email: user.email, nombre: user.nombre },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res
  .cookie('token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Strict',
    maxAge: 2 * 60 * 60 * 1000
  })
  .status(201)
  .json({ user });


  } catch (err) {
    console.error('Error en registerEmpleado:', err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};
  // ======================= ADMIN LOGIN ===========================
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y contraseña son requeridos' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM Administradores WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const admin = result.rows[0];

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const payload = {
      sub: admin.id,
      email: admin.email,
      nombre: admin.nombre,
      rol: admin.rol
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });

    return res
      .cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 2 * 60 * 60 * 1000
      })
      .status(200)
      .json({
        user: {
          id: admin.id,
          nombre: admin.nombre,
          email: admin.email,
          rol: admin.rol
        }
      });

  } catch (err) {
    console.error('Error en loginAdmin:', err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// ======================= ADMIN REGISTER ===========================
exports.registerAdmin = async (req, res) => {
  const { nombre, email, password, rol = 'rrhh' } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos' });
  }

  try {
    const existing = await pool.query(
      'SELECT * FROM Administradores WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO Administradores (nombre, email, password, rol)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, email, rol;`,
      [nombre, email, hashed, rol]
    );

    const admin = result.rows[0];

    const token = jwt.sign(
      { sub: admin.id, email: admin.email, nombre: admin.nombre, rol: admin.rol },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res
      .cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        maxAge: 2 * 60 * 60 * 1000
      })
      .status(201)
      .json({ user: admin });

  } catch (err) {
    console.error('Error en registerAdmin:', err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};


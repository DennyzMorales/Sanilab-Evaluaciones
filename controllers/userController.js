const jwt = require('jsonwebtoken');

const obtenerUsuario = (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: 'No autorizado' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ id: decoded.id, nombre: decoded.nombre || 'Empleado' });
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = { obtenerUsuario };

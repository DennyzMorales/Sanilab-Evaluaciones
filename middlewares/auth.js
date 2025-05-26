const jwt = require('jsonwebtoken');

// IMPORTANTE: Asegúrate de tener esto
const JWT_SECRET = process.env.JWT_SECRET || 'tu_secreto_default';

function verificarToken(req, res, next) {
  const token = req.cookies.token; // Si estás usando cookies

  if (!token) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // payload = { sub, email, nombre }
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
}

module.exports = verificarToken;

const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const token = req.cookies.token;

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


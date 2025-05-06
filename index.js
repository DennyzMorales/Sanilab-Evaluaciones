const express = require('express');
const app = express();
const cors = require('cors');
const autoevaluacionesRoutes = require('./routes/autoevaluaciones');
const empleadosRoutes = require('./routes/empleados');
const administradoresRoutes = require('./routes/administradores');
const authRoutes = require('./routes/auth');
app.use(cors()); // Habilita CORS

// Usamos express.json() para manejar el cuerpo de las solicitudes con formato JSON
app.use(express.json());
app.use('/api/autoevaluaciones', autoevaluacionesRoutes);
app.use('/api/empleados', empleadosRoutes);
app.use('/api/administradores', administradoresRoutes);
app.use('/api/auth',authRoutes)
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});

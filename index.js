const express = require('express');
const app = express();
const cors = require('cors');
const autoevaluacionesRoutes = require('./routes/autoevaluaciones');
const empleadosRoutes = require('./routes/empleados');
const administradoresRoutes = require('./routes/administradores');
const authRoutes = require('./routes/auth');

app.use(cors({
  origin: 'http://localhost:5173,https://sanilab-evaluaciones-frontend-kerk.onrender.com',
  credentials: true // si vas a usar cookies o headers de autenticación
}));
// Usamos express.json() para manejar el cuerpo de las solicitudes con formato JSON
app.use(express.json());
app.use('/api/autoevaluaciones', autoevaluacionesRoutes);
app.use('/api/empleados', empleadosRoutes);
app.use('/api/administradores', administradoresRoutes);
app.use('/api/auth',authRoutes)

app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});
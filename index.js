const express = require('express');
const app = express();
const cors = require('cors');
const autoevaluacionesRoutes = require('./routes/autoevaluaciones');
const empleadosRoutes = require('./routes/empleados');
const administradoresRoutes = require('./routes/administradores');
const authRoutes = require('./routes/auth');
const respuestasRoutes = require('./routes/respuestas');
const preguntasRoutes = require('./routes/preguntas');
const getUserCookie = require('./routes/user')
const cookieParser = require('cookie-parser');

app.use(cookieParser());
const allowedOrigins = [
  'http://localhost:5173',
  'https://sanilab-evaluaciones-frontend-kerk.onrender.com',
  'http://localhost:3000'
];

app.use(cors({
  origin: function(origin, callback){
    // Permitir solicitudes sin origen (como Postman o curl)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'El CORS no está permitido para este origen: ' + origin;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Usamos express.json() para manejar el cuerpo de las solicitudes con formato JSON
app.use(express.json());
app.use('/api/autoevaluaciones', autoevaluacionesRoutes);
app.use('/api/empleados', empleadosRoutes);
app.use('/api/administradores', administradoresRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/respuestas',respuestasRoutes);
app.use('/api/preguntas',preguntasRoutes);
app.use('/api/user',getUserCookie);
app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});
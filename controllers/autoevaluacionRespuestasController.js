const pool = require('../db'); // conexión a PostgreSQL
const servicio = require('../services/autoevaluacionesServicios'); // si lo necesitas
const googleDocsService = require('../services/googleDocsServices');

// Crear respuesta de autoevaluación
exports.crearRespuestaAutoevaluacion = async (req, res) => {
    const {
        autoevaluacion_id,
        pregunta_id,
        respuesta
    } = req.body;

    // Validación básica
    if (
        !autoevaluacion_id ||
        !pregunta_id ||
        respuesta === undefined ||
        respuesta < 0 ||
        respuesta > 10
    ) {
        return res.status(400).json({ message: 'Datos inválidos' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO RespuestasAutoevaluacion (autoevaluacion_id, pregunta_id, respuesta)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [autoevaluacion_id, pregunta_id, respuesta]
        );

        res.status(201).json({
            message: 'Respuesta creada correctamente',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error al crear respuesta:', error);
        res.status(500).json({ message: 'Error al crear respuesta' });
    }
};
// controllers/respuestasController.js



exports.enviarUltimaRespuestaAGoogleDocs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        e.nombre, 
        r.respuesta AS puntaje, 
        a.fecha
      FROM RespuestasAutoevaluacion r
      JOIN Autoevaluaciones a ON r.autoevaluacion_id = a.id
      JOIN Empleados e ON a.empleado_id = e.id
      ORDER BY r.id DESC
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'No hay respuestas para enviar' });
    }

    const { nombre, puntaje, fecha } = result.rows[0];

    const resultado = await googleDocsService.enviarRespuesta({ nombre, puntaje, fecha });

    res.status(200).json({ mensaje: 'Enviado correctamente a Google Docs', resultado });
  } catch (error) {
    console.error('Error al enviar respuesta:', error);
    res.status(500).json({ mensaje: 'Error al enviar respuesta', error: error.message });
  }
};

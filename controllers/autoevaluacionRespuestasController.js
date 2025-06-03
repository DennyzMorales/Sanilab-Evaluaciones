const pool = require('../db'); // conexión a PostgreSQL
const servicio = require('../services/autoevaluacionesServicios'); // si lo necesitas
const googleDocsService = require('../services/googleDocsServices');

// Crear respuesta de autoevaluación
exports.crearRespuestasAutoevaluacion = async (req, res) => {
  const { autoevaluacion_id, respuestas } = req.body;

  if (!autoevaluacion_id || !Array.isArray(respuestas)) {
    return res.status(400).json({ message: 'Datos inválidos' });
  }

  try {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      for (const r of respuestas) {
        if (
          typeof r.pregunta_id !== 'number' ||
          typeof r.respuesta !== 'number' ||
          r.respuesta < 0 ||
          r.respuesta > 10
        ) {
          throw new Error('Datos de respuesta inválidos');
        }

        await client.query(
          `INSERT INTO RespuestasAutoevaluacion (autoevaluacion_id, pregunta_id, respuesta)
           VALUES ($1, $2, $3)`,
          [autoevaluacion_id, r.pregunta_id, r.respuesta]
        );
      }

      await client.query('COMMIT');
      res.status(201).json({ message: 'Respuestas creadas correctamente' });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(err);
      res.status(400).json({ message: err.message });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
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
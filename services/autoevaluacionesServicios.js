const pool = require('../db');

async function obtenerAutoevaluacionesConRespuestas() {
  const result = await pool.query(`
    SELECT 
      e.nombre AS empleado,
      a.fecha,
      p.texto AS pregunta,
      r.respuesta
    FROM Autoevaluaciones a
    INNER JOIN Empleados e ON a.empleado_id = e.id
    INNER JOIN RespuestasAutoevaluacion r ON r.autoevaluacion_id = a.id
    INNER JOIN PreguntasAutoevaluacion p ON p.id = r.pregunta_id
    ORDER BY a.fecha DESC, e.nombre
  `);
  return result.rows;
}

module.exports = {
  obtenerAutoevaluacionesConRespuestas,
};

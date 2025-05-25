const pool = require('../db');
const dayjs = require('dayjs');

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

const crearAutoevaluacion = async (empleadoId, tipo) => {
  const hoy = dayjs().format('YYYY-MM-DD');

  const [rows] = await db.query(
    'SELECT 1 FROM autoevaluaciones WHERE empleado_id = ? AND fecha = ? AND tipo = ? LIMIT 1',
    [empleadoId, hoy, tipo]
  );

  if (rows.length > 0) {
    throw { status: 400, message: 'Ya realizaste esta autoevaluación hoy.' };
  }

  await db.query(
    'INSERT INTO autoevaluaciones (empleado_id, fecha, tipo) VALUES (?, ?, ?)',
    [empleadoId, hoy, tipo]
  );

  return 'Autoevaluación registrada.';
};

module.exports = {
  obtenerAutoevaluacionesConRespuestas,
  crearAutoevaluacion,
};

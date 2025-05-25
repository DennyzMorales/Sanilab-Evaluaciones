const pool = require('../db'); // usa tu archivo de conexión a PostgreSQL
const servicio = require('../services/autoevaluacionesServicios');
const autoevaluacionService = require('../services/autoevaluacionService');

// Crear autoevaluación
exports.crearAutoevaluacion = async (req, res) => {
  const { empleado_id, comentario } = req.body;

  // Validaciones básicas
  if (!empleado_id) {
    return res.status(400).json({ message: 'El campo empleado_id es obligatorio' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO Autoevaluaciones (empleado_id, comentario)
       VALUES ($1, $2) RETURNING *`,
      [empleado_id, comentario]
    );

    res.status(201).json({
      message: 'Autoevaluación creada correctamente',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al crear autoevaluación:', error);
    res.status(500).json({ message: 'Error al crear autoevaluación' });
  }
};

exports.crearAutoevaluacionValidar = async (req , res, next) =>{
    try {
      const { empleadoId, tipo } = req.body;

      const resultado = await autoevaluacionService.crearAutoevaluacion(empleadoId, tipo);
      res.status(200).json({ mensaje: resultado });
    } catch (err) {
      next(err); // manejo centralizado de errores
    }
};  
// Obtener todas las autoevaluaciones (admin)
exports.obtenerTodas = async (req, res) => {
  try {
    const datos = await servicio.obtenerAutoevaluacionesConRespuestas();
    res.json(datos);
  } catch (err) {
    console.error('Error en controller:', err);
    res.status(500).json({ error: 'Error al obtener autoevaluaciones' });
  }
};


// Obtener autoevaluaciones por empleado
exports.obtenerPorEmpleado = async (req, res) => {
  const { empleado_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Autoevaluaciones WHERE empleado_id = $1', [empleado_id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener autoevaluaciones del empleado' });
  }
};

// Actualizar una autoevaluación
exports.actualizarAutoevaluacion = async (req, res) => {
  const { id } = req.params;
  const {
    desempeno, comunicacion, trabajo_en_equipo, proactividad,
    comentario, logros, dificultades, estado_emocional, nivel_energia,
    modificado_por
  } = req.body;

  try {
    const result = await pool.query(`
      UPDATE Autoevaluaciones
      SET desempeno = $1, comunicacion = $2, trabajo_en_equipo = $3, proactividad = $4,
          comentario = $5, logros = $6, dificultades = $7, estado_emocional = $8,
          nivel_energia = $9, modificado_el = CURRENT_TIMESTAMP, modificado_por = $10
      WHERE id = $11 RETURNING *
    `, [
      desempeno, comunicacion, trabajo_en_equipo, proactividad,
      comentario, logros, dificultades, estado_emocional, nivel_energia,
      modificado_por, id
    ]);

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar autoevaluación', detalle: err.message });
  }
};

// Eliminar (si lo necesitas)
exports.eliminarAutoevaluacion = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Autoevaluaciones WHERE id = $1', [id]);
    res.json({ mensaje: 'Autoevaluación eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar' });
  }
};

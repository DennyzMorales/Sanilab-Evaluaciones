const pool = require('../db'); // conexión a PostgreSQL
const servicio = require('../services/autoevaluacionesServicios');

// Crear pregunta
exports.crearAutoevaluacionPregunta = async (req, res) => {
    const {
        texto,
        activa,
        orden,
        obligatoria
    } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO PreguntasAutoevaluacion (texto, activa, orden, obligatoria)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [texto, activa, orden, obligatoria]
        );
            
            res.status(201).json({
                message: 'Pregunta creada correctamente',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error al crear pregunta:', error);
        res.status(500).json({ message: 'Error al crear la pregunta' });
    }
};

exports.obtenerAutoevaluacionPreguntas = async (req, res) => {
    try {
        const result = await pool.query(
        `SELECT * FROM PreguntasAutoevaluacion WHERE activa = TRUE ORDER BY orden`
        );
        res.json(result.rows);
    } catch (err){
        res.status(500).json({ error: 'Error al obtener preguntas', detalle: err.message });
    }
}



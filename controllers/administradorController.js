const pool = require('../db');

// Crear un administrador
exports.crearAdministrador = async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  try {
    const result = await pool.query(`
      INSERT INTO Administradores (
        id, nombre, email, password, rol
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4
      ) RETURNING *
    `, [nombre, email, password, rol || 'rrhh']);

  } catch (err) {
    res.status(201).json(result.rows[0]);
    res.status(500).json({ error: 'Error al crear administrador', detalle: err.message });
  }
};

// Obtener todos los administradores
exports.obtenerAdministradores = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Administradores ORDER BY creado_el DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener administradores', detalle: err.message });
  }
};

// Obtener un administrador por ID
exports.obtenerPorAdministrador = async (req, res) => {
  const { empleado_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Administradores WHERE id = $1', [empleado_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Administrador no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener administrador', detalle: err.message });
  }
};

// Actualizar un administrador
exports.actualizarAdministrador = async (req, res) => {
  const { id } = req.params;
  const { nombre, email, password, rol } = req.body;

  try {
    const result = await pool.query(`
      UPDATE Administradores
      SET nombre = $1, email = $2, password = $3, rol = $4
      WHERE id = $5
      RETURNING *
    `, [nombre, email, password, rol, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Administrador no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar administrador', detalle: err.message });
  }
};

// Eliminar un administrador (opcional)
exports.eliminarAdministrador = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM Administradores WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Administrador no encontrado' });
    }

    res.json({ mensaje: 'Administrador eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar administrador', detalle: err.message });
  }
};

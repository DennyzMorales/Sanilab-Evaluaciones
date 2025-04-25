const pool = require('../db'); // Usa tu archivo de conexión a PostgreSQL

// Crear empleado
exports.crearEmpleado = async (req, res) => {
  const {
    nombre,
    email,
    telefono,
    documento,
    password,
    puesto,
    departamento
  } = req.body;

  try {
    const result = await pool.query(`
      INSERT INTO Empleados (
        id, nombre, email, telefono, documento, password, puesto, departamento
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7
      ) RETURNING *
    `, [
      nombre, email, telefono, documento, password, puesto, departamento
    ]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear empleado', detalle: err.message });
  }
};

// Obtener todos los empleados (admin)
exports.obtenerTodosEmpleados = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Empleados ORDER BY fecha_ingreso DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
};

// Obtener un empleado por su ID
exports.obtenerEmpleadoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM Empleados WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el empleado', detalle: err.message });
  }
};

// Actualizar un empleado
exports.actualizarEmpleado = async (req, res) => {
  const { id } = req.params;
  const {
    nombre, email, telefono, documento, password, puesto, departamento, activo
  } = req.body;

  try {
    const result = await pool.query(`
      UPDATE Empleados
      SET nombre = $1, email = $2, telefono = $3, documento = $4, password = $5, puesto = $6,
          departamento = $7, activo = $8, modificado_el = CURRENT_TIMESTAMP
      WHERE id = $9 RETURNING *
    `, [
      nombre, email, telefono, documento, password, puesto, departamento, activo, id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar empleado', detalle: err.message });
  }
};

// Eliminar un empleado
exports.eliminarEmpleado = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM Empleados WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empleado no encontrado' });
    }
    res.json({ mensaje: 'Empleado eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar empleado', detalle: err.message });
  }
};

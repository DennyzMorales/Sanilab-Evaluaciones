const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/empleadoControllers');

router.post('/', ctrl.crearEmpleado);
router.get('/', ctrl.obtenerTodosEmpleados);
router.get('/:empleado_id', ctrl.obtenerEmpleadoPorId);
router.put('/:id', ctrl.actualizarEmpleado);
router.delete('/:id', ctrl.eliminarEmpleado); // opcional

module.exports = router;


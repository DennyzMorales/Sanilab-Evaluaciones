const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/autoevaluacionControllers');

router.post('/', ctrl.crearAutoevaluacion);
router.get('/', ctrl.obtenerTodas);
router.get('/:empleado_id', ctrl.obtenerPorEmpleado);
router.put('/:id', ctrl.actualizarAutoevaluacion);
router.delete('/:id', ctrl.eliminarAutoevaluacion); // opcional

module.exports = router;


const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/administradorController');

router.post('/', ctrl.crearAdministrador);
router.get('/', ctrl.obtenerAdministradores);
router.get('/:empleado_id', ctrl.obtenerPorAdministrador);
router.put('/:id', ctrl.actualizarAdministrador);
router.delete('/:id', ctrl.eliminarAdministrador); // opcional

module.exports = router;

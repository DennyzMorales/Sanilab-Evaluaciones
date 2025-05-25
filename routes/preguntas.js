const express = require('express');
const router = express.Router();
const ctrl = require("../controllers/autoevaluacionPreguntasController");

router.post('/', ctrl.crearAutoevaluacionPregunta);
router.get('/', ctrl.obtenerAutoevaluacionPreguntas);
module.exports = router;

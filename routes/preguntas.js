const express = require('express');
const router = express.Router();
const ctrl = require("../controllers/autoevaluacionPreguntasController");

router.post('/', ctrl.crearAutoevaluacionPregunta);

module.exports = router;

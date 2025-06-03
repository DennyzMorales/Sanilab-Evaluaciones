const express = require('express');
const router = express.Router();
const ctrl = require("../controllers/autoevaluacionRespuestasController");

router.post('/', ctrl.crearRespuestasAutoevaluacion);
router.post('/docs', ctrl.enviarUltimaRespuestaAGoogleDocs);

module.exports = router;

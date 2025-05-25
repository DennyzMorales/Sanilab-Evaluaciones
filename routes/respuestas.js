const express = require('express');
const router = express.Router();
const ctrl = require("../controllers/autoevaluacionRespuestasController");

router.post('/', ctrl.crearRespuestaAutoevaluacion);
router.post('/docs', ctrl.enviarUltimaRespuestaAGoogleDocs);

module.exports = router;

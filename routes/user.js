const express = require('express');
const router = express.Router();
const { obtenerUsuario } = require('../controllers/userController');

router.get('/me', obtenerUsuario);
module.exports = router;

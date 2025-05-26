const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');

router.post('/login', ctrl.loginEmpleado);
router.post('/register', ctrl.registerEmpleado);

router.post('/login-admin', ctrl.loginAdmin);
router.post('/register-admin', ctrl.registerAdmin);
module.exports = router;


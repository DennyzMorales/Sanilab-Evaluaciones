const express = require("express");
const ctrl = require("../controllers/excelController");

const router = express.Router();

router.get("/download", ctrl.exportExcel);

module.exports = router;
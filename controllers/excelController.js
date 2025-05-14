const pool = require('../db');
const excelJS = require("exceljs");
const User = require("../models/User");

exports.exportExcel = async (req, res) => {
    const workbook = new excelJS.Workbook(); 
    const worksheet = workbook.addWorksheet("Assestment");

    worksheet.columns = [ 
        { header: 'Empleado', key: 'empleado', width: 20 },
        { header: 'Fecha', key: 'fecha', width: 15 },
        { header: 'Pregunta', key: 'pregunta', width: 30 },
        { header: 'Respuesta', key: 'respuesta', width: 10 },
        { header: 'Comentario', key: 'comentario', width: 30 },
    ];

    // Add data to the worksheet 
User.forEach(user => { worksheet.addRow(user); });

    // Set up the response headers 
res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"); res.setHeader("Content-Disposition", "attachment; filename=" + "users.xlsx");

    // Write the workbook to the response object 
workbook.xlsx.write(res).then(() => res.end());
}

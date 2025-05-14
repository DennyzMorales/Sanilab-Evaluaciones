require('dotenv').config(); // Carga las variables de .env

const { Pool } = require('pg');

const EnProduccion = process.env.NODE_ENV === 'production';
const pool = new Pool(
  EnProduccion
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        connectionString: process.env.DATABASE_URL_EXTERNAL,
        ssl: { rejectUnauthorized: false },
      }
);

module.exports = pool;


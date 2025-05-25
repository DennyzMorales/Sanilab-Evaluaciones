require('dotenv').config(); // Carga las variables de .env

const { Pool } = require('pg');

// const EnProduccion = process.env.NODE_ENV === 'production';
// const pool = new Pool(
//   EnProduccion
//     ? {
//         connectionString: process.env.DATABASE_URL,
//         ssl: { rejectUnauthorized: false },
//       }
//     : {
//         connectionString: process.env.DATABASE_URL_EXTERNAL,
//         ssl: { rejectUnauthorized: false },
//       }
// );

const pool = new Pool({
  host: 'aws-0-us-east-2.pooler.supabase.com',
  port: 6543,
  database: 'postgres',
  user: 'postgres.uwnfvlwndqvcrrujbmul',
  password: 'fVeyCv9m5LcxTsel', // ← ¡Muy importante!
  ssl: {
    rejectUnauthorized: false // necesario para conexiones seguras con Supabase
  }
});

module.exports = pool;


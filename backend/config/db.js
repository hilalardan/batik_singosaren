const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'batik_singosaren'
});

db.connect((err) => {
  if (err) {
    console.error('Koneksi database gagal:', err.message);
    return;
  }
  console.log(`Terhubung ke MySQL (${process.env.DB_NAME})`);
});

module.exports = db;
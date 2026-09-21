const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "batik_singosaren",

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.query("SELECT 1", (err) => {
  if (err) {
    console.error("Koneksi database gagal:", err.message);
    return;
  }

  console.log(`Terhubung ke MySQL (${process.env.DB_NAME})`);
});

module.exports = db;

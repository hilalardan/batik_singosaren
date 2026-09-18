// backend/models/artikelModel.js
const db = require("../config/db");

const findAllArtikel = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM artikel", (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const findArtikelById = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM artikel WHERE id = ?", [id], (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0] || null);
    });
  });
};

const insertArtikel = (data) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO artikel (judul, ringkasan, isi, gambar) VALUES (?, ?, ?, ?)`;
    db.query(sql, [data.judul, data.ringkasan, data.isi, data.gambar], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};

const updateArtikel = (id, data) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE artikel SET judul = ?, ringkasan = ?, isi = ?, gambar = ? WHERE id = ?`;
    db.query(sql, [data.judul, data.ringkasan, data.isi, data.gambar, id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows);
    });
  });
};

const deleteArtikel = (id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM artikel WHERE id = ?", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows);
    });
  });
};

module.exports = { findAllArtikel, findArtikelById, insertArtikel, updateArtikel, deleteArtikel };
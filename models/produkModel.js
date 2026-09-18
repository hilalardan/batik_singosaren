// backend/models/produkModel.js
const db = require("../config/db");

const findAllProduk = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM produk", (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const findProdukById = (id_produk) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM produk WHERE id_produk = ?", [id_produk], (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0] || null);
    });
  });
};

const insertProduk = (data) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO produk (nama_produk, deskripsi, harga, gambar, kategori) VALUES (?, ?, ?, ?, ?)`;
    const values = [data.nama_produk, data.deskripsi, data.harga, data.gambar, data.kategori];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};

const updateProduk = (id_produk, data) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE produk SET nama_produk = ?, deskripsi = ?, harga = ?, gambar = ?, kategori = ?
      WHERE id_produk = ?
    `;
    const values = [data.nama_produk, data.deskripsi, data.harga, data.gambar, data.kategori, id_produk];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows);
    });
  });
};

const deleteProduk = (id_produk) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM produk WHERE id_produk = ?", [id_produk], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows);
    });
  });
};

module.exports = { findAllProduk, findProdukById, insertProduk, updateProduk, deleteProduk };
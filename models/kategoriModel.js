const db = require("../config/db");

// Ambil semua kategori
const findAllKategori = (callback) => {
    db.query(
        "SELECT * FROM kategori ORDER BY id_kategori ASC",
        callback
    );
};

// Ambil kategori berdasarkan ID
const findKategoriById = (id_kategori, callback) => {
    db.query(
        "SELECT * FROM kategori WHERE id_kategori = ?",
        [id_kategori],
        callback
    );
};

// Tambah kategori
const createKategori = (nama_kategori, callback) => {
    db.query(
        "INSERT INTO kategori (nama_kategori) VALUES (?)",
        [nama_kategori],
        callback
    );
};

// Update kategori
const updateKategori = (id_kategori, nama_kategori, callback) => {
    db.query(
        "UPDATE kategori SET nama_kategori = ? WHERE id_kategori = ?",
        [nama_kategori, id_kategori],
        callback
    );
};

// Hapus kategori
const deleteKategori = (id_kategori, callback) => {
    db.query(
        "DELETE FROM kategori WHERE id_kategori = ?",
        [id_kategori],
        callback
    );
};

module.exports = {
    findAllKategori,
    findKategoriById,
    createKategori,
    updateKategori,
    deleteKategori
};
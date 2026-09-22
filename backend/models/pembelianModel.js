// backend/models/pembelianModel.js
const db = require("../config/db");

const findAllPembelianWithDetail = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        p.*,
        pr.nama_produk,
        pr.harga,
        (pr.harga * p.jumlah) AS total,
        pr.gambar AS gambar_produk,
        u.nama_d,
        u.nama_b,
        u.email
      FROM pembelian p
      JOIN produk pr ON p.id_produk = pr.id_produk
      JOIN users u ON p.id_pembeli = u.id
      ORDER BY p.created_at DESC
    `;

    db.query(sql, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const findPembelianById = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM pembelian WHERE id = ?",
      [id],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows[0] || null);
      }
    );
  });
};

// Update pembelian
const updatePembelian = (id, data) => {
  return new Promise((resolve, reject) => {
    const kolomDiizinkan = [
      "jumlah",
      "nama_pembeli",
      "alamat_pembeli",
      "phone_pembeli",
      "metode_pembayaran",
      "pembayaran",
      "pengiriman",
      "status",
      "catatan",
      "foto_bukti",
    ];

    const kolomDiisi = kolomDiizinkan.filter(
      (k) => data[k] !== undefined
    );

    if (kolomDiisi.length === 0) {
      return resolve(0);
    }

    const setClause = kolomDiisi
      .map((k) => `${k} = ?`)
      .join(", ");

    const values = kolomDiisi.map((k) => data[k]);

    values.push(id);

    db.query(
      `UPDATE pembelian SET ${setClause} WHERE id = ?`,
      values,
      (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows);
      }
    );
  });
};

const deletePembelian = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      "DELETE FROM pembelian WHERE id = ?",
      [id],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows);
      }
    );
  });
};

// Insert pembelian
const insertPembelian = (data) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO pembelian
        (
          id_pembeli,
          id_produk,
          jumlah,
          nama_pembeli,
          alamat_pembeli,
          phone_pembeli,
          metode_pembayaran,
          pengiriman,
          catatan
        )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      data.id_pembeli,
      data.id_produk,
      data.jumlah || 1,
      data.nama_pembeli,
      data.alamat_pembeli,
      data.phone_pembeli,
      data.metode_pembayaran,
      data.pengiriman,
      data.catatan || null,
    ];

    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};

const findPembelianByPembeliIdWithDetail = (id_pembeli) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        p.*,
        pr.nama_produk,
        pr.harga,
        pr.gambar AS gambar_produk
      FROM pembelian p
      JOIN produk pr ON p.id_produk = pr.id_produk
      WHERE p.id_pembeli = ?
      ORDER BY p.created_at DESC
    `;

    db.query(sql, [id_pembeli], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const findPembelianByIdAndPembeliId = (id, id_pembeli) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM pembelian WHERE id = ? AND id_pembeli = ?",
      [id, id_pembeli],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows[0] || null);
      }
    );
  });
};

// Statistik pembeli
const getStatsByPembeliId = (id_pembeli) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        COUNT(*) AS total_pembelian,
        COALESCE(SUM(pr.harga * p.jumlah), 0) AS total_belanja,
        SUM(p.status = 'Tertunda') AS total_tertunda,
        SUM(p.status = 'Dikemas') AS total_dikemas,
        SUM(p.status = 'Dikirim') AS total_dikirim,
        SUM(p.status = 'Diterima') AS total_diterima,
        SUM(p.status = 'Selesai') AS total_selesai
      FROM pembelian p
      JOIN produk pr ON p.id_produk = pr.id_produk
      WHERE p.id_pembeli = ?
    `;

    db.query(sql, [id_pembeli], (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0]);
    });
  });
};

// Statistik admin
const getAdminStats = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        COUNT(*) AS total_pembelian,
        COALESCE(SUM(pr.harga * p.jumlah), 0) AS total_pendapatan,
        SUM(p.status = 'Tertunda') AS total_tertunda,
        SUM(p.status = 'Dikemas') AS total_dikemas,
        SUM(p.status = 'Dikirim') AS total_dikirim,
        SUM(p.status = 'Diterima') AS total_diterima,
        SUM(p.status = 'Selesai') AS total_selesai
      FROM pembelian p
      JOIN produk pr ON p.id_produk = pr.id_produk
    `;

    db.query(sql, (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0]);
    });
  });
};

// Pembelian terbaru
const getRecentPembelian = (limit = 5) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        p.*,
        pr.nama_produk,
        u.nama_d,
        u.nama_b
      FROM pembelian p
      JOIN produk pr ON p.id_produk = pr.id_produk
      JOIN users u ON p.id_pembeli = u.id
      ORDER BY p.created_at DESC
      LIMIT ?
    `;

    db.query(sql, [limit], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

// Laporan Penjualan
const getLaporanPenjualan = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        p.id,
        p.created_at,
        p.nama_pembeli,
        pr.nama_produk,
        pr.harga,
        p.jumlah,
        (pr.harga * p.jumlah) AS total,
        p.metode_pembayaran,
        p.pengiriman,
        p.status
      FROM pembelian p
      JOIN produk pr ON p.id_produk = pr.id_produk
      ORDER BY p.created_at DESC
    `;

    db.query(sql, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

module.exports = {
  findAllPembelianWithDetail,
  findPembelianById,
  updatePembelian,
  deletePembelian,
  insertPembelian,
  findPembelianByPembeliIdWithDetail,
  findPembelianByIdAndPembeliId,
  getStatsByPembeliId,
  getAdminStats,
  getRecentPembelian,
  getLaporanPenjualan,
};

// backend/models/usersModel.js
const db = require("../config/db");

const createUser = (data) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO users
        (nama_d, nama_b, kelamin, lahir, alamat, phone, email, role, uname, passwd, foto)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.nama_d, data.nama_b, data.kelamin, data.lahir, data.alamat,
      data.phone, data.email, data.role, data.uname, data.passwd, data.foto,
    ];
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
    });
  });
};

const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0] || null);
    });
  });
};

const findUserByCredential = (credential) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM users WHERE email = ? OR uname = ?", [credential, credential], (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0] || null);
    });
  });
};

const findUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT id, nama_d, nama_b, kelamin, lahir, alamat, phone, email, role, uname, foto, created_at, updated_at
      FROM users WHERE id = ?
    `;
    db.query(sql, [id], (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0] || null);
    });
  });
};

const findPasswdHashById = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT passwd FROM users WHERE id = ?", [id], (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0] ? rows[0].passwd : null);
    });
  });
};

// Update partial - cuma kolom yang benar-benar dikirim yang diubah
const updateUserProfile = (id, data) => {
  return new Promise((resolve, reject) => {
    const kolomDiizinkan = ["nama_d", "nama_b", "kelamin", "lahir", "alamat", "phone", "foto", "passwd"];
    const kolomDiisi = kolomDiizinkan.filter((k) => data[k] !== undefined);

    if (kolomDiisi.length === 0) return resolve(0);

    const setClause = kolomDiisi.map((k) => `${k} = ?`).join(", ");
    const values = kolomDiisi.map((k) => data[k]);
    values.push(id);

    db.query(`UPDATE users SET ${setClause} WHERE id = ?`, values, (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows);
    });
  });
};

const findAllPembeli = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT id, nama_d, nama_b, kelamin, lahir, alamat, phone, email, role, uname, foto, created_at, updated_at
      FROM users WHERE role = 'pembeli'
    `;
    db.query(sql, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const findAllUsers = (role) => {
  return new Promise((resolve, reject) => {
    let sql = `
      SELECT id, nama_d, nama_b, kelamin, lahir, alamat, phone, email, role, uname, foto, created_at, updated_at
      FROM users
    `;
    const values = [];
    if (role) {
      sql += " WHERE role = ?";
      values.push(role);
    }
    db.query(sql, values, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

const deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows);
    });
  });
};

module.exports = {
  createUser, findUserByEmail, findUserByCredential, findUserById,
  findPasswdHashById, updateUserProfile, findAllPembeli, findAllUsers, deleteUser,
};
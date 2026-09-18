// backend/controllers/adminController.js

const bcrypt = require("bcrypt");
const db = require("../config/db");

const produkModel = require("../models/produkModel");
const usersModel = require("../models/usersModel");
const artikelModel = require("../models/artikelModel");
const pembelianModel = require("../models/pembelianModel");
const kategoriModel = require("../models/kategoriModel");

const listProduk = async (req, res) => {
  try {
    const data = await produkModel.findAllProduk();

    res.json({
      success: true,
      data
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Gagal mengambil data produk",
      error: err.message
    });
  }
};

const getProdukById = async (req, res) => {
  try {
    const produk = await produkModel.findProdukById(req.params.id);

    if (!produk) {
      return res.json({
        success: false,
        message: "Produk tidak ditemukan"
      });
    }

    res.json({
      success: true,
      data: produk
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Gagal mengambil data produk",
      error: err.message
    });
  }
};

const createProduk = async (req, res) => {
  try {
    const { kategori } = req.body;

    if (!kategori) {
      return res.json({
        success: false,
        message: "Kategori wajib dipilih"
      });
    }

    const cekKategori = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM kategori WHERE nama_kategori = ?",
        [kategori],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });

    if (cekKategori.length === 0) {
      return res.json({
        success: false,
        message: "Kategori tidak ditemukan"
      });
    }

    const insertId = await produkModel.insertProduk(req.body);

    res.json({
      success: true,
      message: "Produk berhasil ditambahkan",
      id: insertId
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Gagal menambah produk",
      error: err.message
    });
  }
};

const updateProduk = async (req, res) => {
  try {
    const { kategori } = req.body;

    if (!kategori) {
      return res.json({
        success: false,
        message: "Kategori wajib dipilih"
      });
    }

    const cekKategori = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM kategori WHERE nama_kategori = ?",
        [kategori],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });

    if (cekKategori.length === 0) {
      return res.json({
        success: false,
        message: "Kategori tidak ditemukan"
      });
    }

    const hasilUpdate = await produkModel.updateProduk(
      req.params.id,
      req.body
    );

    if (hasilUpdate === 0) {
      return res.json({
        success: false,
        message: "Produk tidak ditemukan atau tidak ada perubahan"
      });
    }

    res.json({
      success: true,
      message: "Produk berhasil diperbarui"
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Gagal memperbarui produk",
      error: err.message
    });
  }
};

const deleteProduk = async (req, res) => {
  try {
    await produkModel.deleteProduk(req.params.id);

    res.json({
      success: true,
      message: "Produk berhasil dihapus"
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Gagal menghapus produk",
      error: err.message
    });
  }
};


// =========================
// KATEGORI
// =========================

const listKategori = (req, res) => {
  kategoriModel.findAllKategori((err, data) => {
    if (err) {
      return res.json({
        success: false,
        message: "Gagal mengambil data kategori",
        error: err.message
      });
    }

    res.json({
      success: true,
      data
    });
  });
};

const getKategoriById = (req, res) => {
  kategoriModel.findKategoriById(
    req.params.id,
    (err, data) => {
      if (err) {
        return res.json({
          success: false,
          message: "Gagal mengambil data kategori",
          error: err.message
        });
      }

      if (!data || data.length === 0) {
        return res.json({
          success: false,
          message: "Kategori tidak ditemukan"
        });
      }

      res.json({
        success: true,
        data: data[0]
      });
    }
  );
};

const createKategori = (req, res) => {
  const nama_kategori = req.body.nama_kategori?.trim();

  if (!nama_kategori) {
    return res.json({
      success: false,
      message: "Nama kategori wajib diisi"
    });
  }

  db.query(
    "SELECT * FROM kategori WHERE nama_kategori = ?",
    [nama_kategori],
    (err, data) => {
      if (err) {
        return res.json({
          success: false,
          message: "Gagal mengecek kategori",
          error: err.message
        });
      }

      if (data.length > 0) {
        return res.json({
          success: false,
          message: "Kategori sudah ada"
        });
      }

      kategoriModel.createKategori(
        nama_kategori,
        (err, result) => {
          if (err) {
            return res.json({
              success: false,
              message: "Gagal menambah kategori",
              error: err.message
            });
          }

          res.json({
            success: true,
            message: "Kategori berhasil ditambahkan",
            id: result.insertId
          });
        }
      );
    }
  );
};

const updateKategori = (req, res) => {
  const nama_kategori = req.body.nama_kategori?.trim();
  const idKategori = req.params.id;

  if (!nama_kategori) {
    return res.json({
      success: false,
      message: "Nama kategori wajib diisi"
    });
  }

  kategoriModel.findKategoriById(
    idKategori,
    (err, data) => {
      if (err) {
        return res.json({
          success: false,
          message: "Gagal mengambil kategori",
          error: err.message
        });
      }

      if (!data || data.length === 0) {
        return res.json({
          success: false,
          message: "Kategori tidak ditemukan"
        });
      }

      const namaKategoriLama = data[0].nama_kategori;

      db.query(
        `SELECT * FROM kategori
         WHERE nama_kategori = ?
         AND id_kategori != ?`,
        [nama_kategori, idKategori],
        (err, dataCek) => {
          if (err) {
            return res.json({
              success: false,
              message: "Gagal mengecek nama kategori",
              error: err.message
            });
          }

          if (dataCek.length > 0) {
            return res.json({
              success: false,
              message: "Nama kategori sudah digunakan"
            });
          }

          kategoriModel.updateKategori(
            idKategori,
            nama_kategori,
            (err, result) => {
              if (err) {
                return res.json({
                  success: false,
                  message: "Gagal memperbarui kategori",
                  error: err.message
                });
              }

              if (result.affectedRows === 0) {
                return res.json({
                  success: false,
                  message: "Kategori tidak ditemukan"
                });
              }

              db.query(
                `UPDATE produk
                 SET kategori = ?
                 WHERE kategori = ?`,
                [nama_kategori, namaKategoriLama],
                (err) => {
                  if (err) {
                    return res.json({
                      success: false,
                      message: "Kategori berhasil diubah, tetapi kategori produk gagal diperbarui",
                      error: err.message
                    });
                  }

                  res.json({
                    success: true,
                    message: "Kategori berhasil diperbarui"
                  });
                }
              );
            }
          );
        }
      );
    }
  );
};

const deleteKategori = (req, res) => {
  kategoriModel.findKategoriById(
    req.params.id,
    (err, data) => {
      if (err) {
        return res.json({
          success: false,
          message: "Gagal mengambil data kategori",
          error: err.message
        });
      }

      if (!data || data.length === 0) {
        return res.json({
          success: false,
          message: "Kategori tidak ditemukan"
        });
      }

      const namaKategori = data[0].nama_kategori;

      db.query(
        `SELECT COUNT(*) AS jumlah
         FROM produk
         WHERE kategori = ?`,
        [namaKategori],
        (err, hasil) => {
          if (err) {
            return res.json({
              success: false,
              message: "Gagal mengecek penggunaan kategori",
              error: err.message
            });
          }

          if (hasil[0].jumlah > 0) {
            return res.json({
              success: false,
              message: "Kategori tidak bisa dihapus karena masih digunakan oleh produk"
            });
          }

          kategoriModel.deleteKategori(
            req.params.id,
            (err, result) => {
              if (err) {
                return res.json({
                  success: false,
                  message: "Gagal menghapus kategori",
                  error: err.message
                });
              }

              if (result.affectedRows === 0) {
                return res.json({
                  success: false,
                  message: "Kategori tidak ditemukan"
                });
              }

              res.json({
                success: true,
                message: "Kategori berhasil dihapus"
              });
            }
          );
        }
      );
    }
  );
};


// =========================
// PEMBELI
// =========================

const listPembeli = async (req, res) => {
  try {
    const data = await usersModel.findAllPembeli();

    res.json({
      success: true,
      data
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Gagal mengambil data pembeli",
      error: err.message
    });
  }
};

const getPembeliById = async (req, res) => {
  try {
    const user = await usersModel.findUserById(req.params.id);

    if (!user) {
      return res.json({
        success: false,
        message: "Pembeli tidak ditemukan"
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Gagal mengambil data pembeli",
      error: err.message
    });
  }
};

const createPembeli = async (req, res) => {
  try {
    const insertId = await usersModel.createUser({
      ...req.body,
      role: "pembeli"
    });

    res.json({
      success: true,
      message: "Pembeli berhasil ditambahkan",
      id: insertId
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Gagal menambah pembeli",
      error: err.message
    });
  }
};

const updatePembeli = async (req, res) => {
  try {
    await usersModel.updateUserProfile(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      message: "Pembeli berhasil diperbarui"
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Gagal memperbarui pembeli",
      error: err.message
    });
  }
};

const deletePembeli = async (req, res) => {
  try {
    await usersModel.deleteUser(req.params.id);

    res.json({
      success: true,
      message: "Pembeli berhasil dihapus"
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Gagal menghapus pembeli",
      error: err.message
    });
  }
};


// =========================
// ARTIKEL
// =========================

const listArtikel = async (req, res) => {
  try {
    const data = await artikelModel.findAllArtikel();

    res.json({
      success: true,
      data
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Gagal mengambil data artikel",
      error: err.message
    });
  }
};

const getArtikelById = async (req, res) => {
  try {
    const artikel = await artikelModel.findArtikelById(
      req.params.id
    );

    if (!artikel) {
      return res.json({
        success: false,
        message: "Artikel tidak ditemukan"
      });
    }

    res.json({
      success: true,
      data: artikel
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Gagal mengambil data artikel",
      error: err.message
    });
  }
};

const createArtikel = async (req, res) => {
  try {
    const insertId = await artikelModel.insertArtikel(
      req.body
    );

    res.json({
      success: true,
      message: "Artikel berhasil ditambahkan",
      id: insertId
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Gagal menambah artikel",
      error: err.message
    });
  }
};

const updateArtikel = async (req, res) => {
  try {
    await artikelModel.updateArtikel(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      message: "Artikel berhasil diperbarui"
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Gagal memperbarui artikel",
      error: err.message
    });
  }
};

const deleteArtikel = async (req, res) => {
  try {
    await artikelModel.deleteArtikel(
      req.params.id
    );

    res.json({
      success: true,
      message: "Artikel berhasil dihapus"
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Gagal menghapus artikel",
      error: err.message
    });
  }
};


// =========================
// STATISTIK
// =========================

const getStats = async (req, res) => {
  try {
    const stats = await pembelianModel.getAdminStats();
    const recent = await pembelianModel.getRecentPembelian();

    res.json({
      success: true,
      data: {
        stats,
        recent
      }
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Gagal mengambil statistik",
      error: err.message
    });
  }
};


// =========================
// PEMBELIAN
// =========================

const listPembelian = async (req, res) => {
  try {
    const data =
      await pembelianModel.findAllPembelianWithDetail();

    res.json({
      success: true,
      data
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Gagal mengambil data pembelian",
      error: err.message
    });
  }
};

const getPembelianById = async (req, res) => {
  try {
    const pembelian =
      await pembelianModel.findPembelianById(
        req.params.id
      );

    if (!pembelian) {
      return res.json({
        success: false,
        message: "Pembelian tidak ditemukan"
      });
    }

    res.json({
      success: true,
      data: pembelian
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Gagal mengambil data pembelian",
      error: err.message
    });
  }
};

const updatePembelian = async (req, res) => {
  try {
    await pembelianModel.updatePembelian(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      message: "Pembelian berhasil diperbarui"
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Gagal memperbarui pembelian",
      error: err.message
    });
  }
};

const deletePembelian = async (req, res) => {
  try {
    await pembelianModel.deletePembelian(
      req.params.id
    );

    res.json({
      success: true,
      message: "Pembelian berhasil dihapus"
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Gagal menghapus pembelian",
      error: err.message
    });
  }
};


// =========================
// PROFILE
// =========================

const getMyProfile = async (req, res) => {
  try {
    const user = await usersModel.findUserById(
      req.user.id
    );

    if (!user) {
      return res.json({
        success: false,
        message: "User tidak ditemukan"
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Terjadi kesalahan server",
      error: err.message
    });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const {
      passwd_lama,
      passwd,
      ...dataProfil
    } = req.body;

    if (passwd) {
      if (!passwd_lama) {
        return res.json({
          success: false,
          message: "Password lama wajib diisi untuk ganti password"
        });
      }

      const hashLama =
        await usersModel.findPasswdHashById(
          req.user.id
        );

      const isMatch = await bcrypt.compare(
        passwd_lama,
        hashLama
      );

      if (!isMatch) {
        return res.json({
          success: false,
          message: "Password lama salah"
        });
      }

      dataProfil.passwd =
        await bcrypt.hash(passwd, 10);
    }

    await usersModel.updateUserProfile(
      req.user.id,
      dataProfil
    );

    res.json({
      success: true,
      message: "Profil berhasil diperbarui"
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Terjadi kesalahan server",
      error: err.message
    });
  }
};


// =========================
// USERS
// =========================

const getUsers = async (req, res) => {
  try {
    const data = await usersModel.findAllUsers(
      req.query.role
    );

    res.json({
      success: true,
      data
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Gagal mengambil data users",
      error: err.message
    });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await usersModel.findUserById(
      req.params.id
    );

    if (!user) {
      return res.json({
        success: false,
        message: "User tidak ditemukan"
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Gagal mengambil data user",
      error: err.message
    });
  }
};

const createUserAdmin = async (req, res) => {
  try {
    const insertId =
      await usersModel.createUser(req.body);

    res.json({
      success: true,
      message: "User berhasil ditambahkan",
      id: insertId
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Gagal menambah user",
      error: err.message
    });
  }
};

const updateUserAdmin = async (req, res) => {
  try {
    await usersModel.updateUserProfile(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      message: "User berhasil diperbarui"
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Gagal memperbarui user",
      error: err.message
    });
  }
};

const deleteUserAdmin = async (req, res) => {
  try {
    await usersModel.deleteUser(
      req.params.id
    );

    res.json({
      success: true,
      message: "User berhasil dihapus"
    });
  } catch (err) {
    res.json({
      success: false,
      message: "Gagal menghapus user",
      error: err.message
    });
  }
};

module.exports = {
  listProduk,
  getProdukById,
  createProduk,
  updateProduk,
  deleteProduk,

  listKategori,
  getKategoriById,
  createKategori,
  updateKategori,
  deleteKategori,

  listPembeli,
  getPembeliById,
  createPembeli,
  updatePembeli,
  deletePembeli,

  listArtikel,
  getArtikelById,
  createArtikel,
  updateArtikel,
  deleteArtikel,

  getStats,

  listPembelian,
  getPembelianById,
  updatePembelian,
  deletePembelian,

  getMyProfile,
  updateMyProfile,

  getUsers,
  getUser,
  createUserAdmin,
  updateUserAdmin,
  deleteUserAdmin
};
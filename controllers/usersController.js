// backend/controllers/usersController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usersModel = require("../models/usersModel");
const pembelianModel = require("../models/pembelianModel");
const produkModel = require("../models/produkModel");
const artikelModel = require("../models/artikelModel");

const METODE_VALID = ["Cash", "Transfer Bank"];
const KURIR_VALID = ["Delivery", "Ambil di Toko"];

// ===== Register =====

const registerUser = async (req, res) => {
  try {
    const {
      nama_d,
      nama_b,
      kelamin,
      lahir,
      alamat,
      phone,
      email,
      uname,
      passwd,
      foto
    } = req.body;

    const existing = await usersModel.findUserByEmail(email);

    if (existing) {
      return res.json({
        success: false,
        message: "Email sudah terdaftar"
      });
    }

    const hashedPasswd = await bcrypt.hash(passwd, 10);

    const insertId = await usersModel.createUser({
      nama_d,
      nama_b,
      kelamin,
      lahir,
      alamat,
      phone,
      email,
      role: "pembeli",
      uname,
      passwd: hashedPasswd,
      foto: foto || "default.jpg",
    });

    res.json({
      success: true,
      message: "Registrasi berhasil",
      id: insertId
    });

  } catch (err) {
    res.json({
      success: false,
      message: "Terjadi kesalahan server",
      error: err.message
    });
  }
};

// ===== Login =====

const loginUser = async (req, res) => {
  try {
    const { credential, passwd } = req.body;

    const user = await usersModel.findUserByCredential(credential);

    if (!user) {
      return res.json({
        success: false,
        message: "Akun tidak ditemukan"
      });
    }

    const isMatch = await bcrypt.compare(passwd, user.passwd);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Password salah"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    // Role dikirim ke frontend
    res.json({
      success: true,
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        role: user.role
      }
    });

  } catch (err) {
    res.json({
      success: false,
      message: "Terjadi kesalahan server",
      error: err.message
    });
  }
};

// ===== Profil (dipakai role pembeli) =====

const getMyProfile = async (req, res) => {
  try {
    const user = await usersModel.findUserById(req.user.id);

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
    const { passwd_lama, passwd, ...dataProfil } = req.body;

    if (passwd) {
      if (!passwd_lama) {
        return res.json({
          success: false,
          message: "Password lama wajib diisi untuk ganti password"
        });
      }

      const hashLama = await usersModel.findPasswdHashById(req.user.id);
      const isMatch = await bcrypt.compare(passwd_lama, hashLama);

      if (!isMatch) {
        return res.json({
          success: false,
          message: "Password lama salah"
        });
      }

      dataProfil.passwd = await bcrypt.hash(passwd, 10);
    }

    await usersModel.updateUserProfile(req.user.id, dataProfil);

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

// ===== Dashboard & Pembelian (role pembeli) =====

const getDashboard = async (req, res) => {
  try {
    const stats = await pembelianModel.getStatsByPembeliId(req.user.id);

    res.json({
      success: true,
      data: stats
    });

  } catch (err) {
    res.json({
      success: false,
      message: "Gagal mengambil data dashboard",
      error: err.message
    });
  }
};

const createPembelian = async (req, res) => {
  try {
    const { metode_pembayaran, pengiriman } = req.body;

    if (!METODE_VALID.includes(metode_pembayaran)) {
      return res.json({
        success: false,
        message: "Metode pembayaran tidak valid"
      });
    }

    if (!KURIR_VALID.includes(pengiriman)) {
      return res.json({
        success: false,
        message: "Pengiriman tidak valid"
      });
    }

    const data = {
      ...req.body,
      id_pembeli: req.user.id
    };

    const insertId = await pembelianModel.insertPembelian(data);

    res.json({
      success: true,
      message: "Pesanan berhasil dibuat",
      id: insertId
    });

  } catch (err) {
    res.json({
      success: false,
      message: "Gagal membuat pesanan",
      error: err.message
    });
  }
};

const listMyPembelian = async (req, res) => {
  try {
    const data =
      await pembelianModel.findPembelianByPembeliIdWithDetail(req.user.id);

    res.json({
      success: true,
      data
    });

  } catch (err) {
    res.json({
      success: false,
      message: "Gagal mengambil riwayat pesanan",
      error: err.message
    });
  }
};

const getMyPembelianById = async (req, res) => {
  try {
    const pembelian =
      await pembelianModel.findPembelianByIdAndPembeliId(
        req.params.id,
        req.user.id
      );

    if (!pembelian) {
      return res.json({
        success: false,
        message: "Pesanan tidak ditemukan"
      });
    }

    res.json({
      success: true,
      data: pembelian
    });

  } catch (err) {
    res.json({
      success: false,
      message: "Gagal mengambil data pesanan",
      error: err.message
    });
  }
};

// ===== Publik (produk & artikel, tanpa login) =====

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
    const produk =
      await produkModel.findProdukById(
        req.params.id_produk || req.params.id
      );

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

const listArtikelPublik = async (req, res) => {
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

const getArtikelPublikById = async (req, res) => {
  try {
    const artikel =
      await artikelModel.findArtikelById(req.params.id);

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

module.exports = {
  registerUser,
  loginUser,
  getMyProfile,
  updateMyProfile,
  getDashboard,
  createPembelian,
  listMyPembelian,
  getMyPembelianById,
  listProduk,
  getProdukById,
  listArtikelPublik,
  getArtikelPublikById,
};
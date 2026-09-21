// server.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const usersRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const produkModel = require("./models/produkModel");
const artikelModel = require("./models/artikelModel");
const kategoriModel = require("./models/kategoriModel");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("API Batik Ponorogo jalan");
});

// ================================
// CEK JWT SECRET
// ================================
app.get("/cek-jwt", (req, res) => {
  const secret = process.env.JWT_SECRET || "";

  res.json({
    success: true,
    jwt_secret_tersedia: secret.length > 0,
    jwt_secret_panjang: secret.length,
  });
});

// ================================
// DEBUG REQUEST
// ================================
app.use((req, res, next) => {
  console.log(
    "REQUEST:",
    req.method,
    req.path,
    "AUTH:",
    req.headers.authorization ? "ADA" : "TIDAK ADA"
  );

  next();
});

app.use("/api/users", usersRoutes);
app.use("/api/admin", adminRoutes);

// ================================
// KATEGORI
// ================================
app.get("/api/kategori", (req, res) => {
  kategoriModel.findAllKategori((err, rows) => {
    if (err) {
      console.error("Gagal mengambil kategori:", err);

      return res.status(500).json({
        success: false,
        message: "Gagal mengambil data kategori",
        error: err.message,
      });
    }

    res.json({
      success: true,
      data: rows,
    });
  });
});

// ================================
// PRODUK
// ================================
app.get("/api/produk", async (req, res) => {
  try {
    const data = await produkModel.findAllProduk();

    res.json({
      success: true,
      data: data,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil data produk",
      error: err.message,
    });
  }
});

// ================================
// DETAIL PRODUK
// ================================
app.get("/api/produk/:id", async (req, res) => {
  try {
    const data = await produkModel.findProdukById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: data,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil detail produk",
      error: err.message,
    });
  }
});

// ================================
// ARTIKEL
// ================================
app.get("/api/artikel", async (req, res) => {
  try {
    const data = await artikelModel.findAllArtikel();

    res.json({
      success: true,
      data: data,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil data artikel",
      error: err.message,
    });
  }
});

// ================================
// DETAIL ARTIKEL
// ================================
app.get("/api/artikel/:id", async (req, res) => {
  try {
    const data = await artikelModel.findArtikelById(req.params.id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Artikel tidak ditemukan",
      });
    }

    res.json({
      success: true,
      data: data,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Gagal mengambil detail artikel",
      error: err.message,
    });
  }
});

// ================================
// SERVER
// ================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});

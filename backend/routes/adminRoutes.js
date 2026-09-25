const express = require("express");
const router = express.Router();

const {
  authenticate,
  requireRole,
  middlewareUploadGambar,
  sendHasilUpload
} = require("../middlewares");

const adminController = require("../controllers/adminController");

// Semua route admin wajib login dan role admin
router.use(authenticate, requireRole("admin"));

// ========================================
// PROFIL ADMIN
// ========================================

router.get("/me", adminController.getMyProfile);
router.put("/me", adminController.updateMyProfile);

// ========================================
// STATISTIK
// ========================================

router.get("/stats", adminController.getStats);

// Grafik penjualan
router.get(
  "/grafik-penjualan",
  adminController.getGrafikPenjualan
);

// ========================================
// LAPORAN PENJUALAN
// ========================================

router.get(
  "/laporan-penjualan",
  adminController.getLaporanPenjualan
);

// ========================================
// PRODUK
// ========================================

router.get("/produk", adminController.listProduk);
router.get("/produk/:id", adminController.getProdukById);
router.post("/produk", adminController.createProduk);
router.put("/produk/:id", adminController.updateProduk);
router.delete("/produk/:id", adminController.deleteProduk);

// ========================================
// KATEGORI
// ========================================

router.get("/kategori", adminController.listKategori);
router.get("/kategori/:id", adminController.getKategoriById);
router.post("/kategori", adminController.createKategori);
router.put("/kategori/:id", adminController.updateKategori);
router.delete("/kategori/:id", adminController.deleteKategori);

// ========================================
// PEMBELI
// ========================================

router.get("/pembeli", adminController.listPembeli);
router.get("/pembeli/:id", adminController.getPembeliById);
router.post("/pembeli", adminController.createPembeli);
router.put("/pembeli/:id", adminController.updatePembeli);
router.delete("/pembeli/:id", adminController.deletePembeli);

// ========================================
// USERS
// ========================================

router.get("/users", adminController.getUsers);
router.get("/users/:id", adminController.getUser);
router.post("/users", adminController.createUserAdmin);
router.put("/users/:id", adminController.updateUserAdmin);
router.delete("/users/:id", adminController.deleteUserAdmin);

// ========================================
// ARTIKEL
// ========================================

router.get("/artikel", adminController.listArtikel);
router.get("/artikel/:id", adminController.getArtikelById);
router.post("/artikel", adminController.createArtikel);
router.put("/artikel/:id", adminController.updateArtikel);
router.delete("/artikel/:id", adminController.deleteArtikel);

// ========================================
// PEMBELIAN
// ========================================

router.get("/pembelian", adminController.listPembelian);
router.get("/pembelian/:id", adminController.getPembelianById);
router.put("/pembelian/:id", adminController.updatePembelian);
router.delete("/pembelian/:id", adminController.deletePembelian);

// ========================================
// UPLOAD GAMBAR
// ========================================

router.post(
  "/upload-gambar",
  middlewareUploadGambar,
  sendHasilUpload
);

module.exports = router;

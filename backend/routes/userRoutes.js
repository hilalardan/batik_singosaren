// backend/routes/users.js
const express = require("express");
const router = express.Router();
const { authenticate, requireRole } = require("../middlewares");
const usersController = require("../controllers/usersController");

router.post("/register", usersController.registerUser);
router.post("/login", usersController.loginUser);

router.get("/me", authenticate, requireRole("pembeli"), usersController.getMyProfile);
router.put("/me", authenticate, requireRole("pembeli"), usersController.updateMyProfile);

router.get("/dashboard", authenticate, requireRole("pembeli"), usersController.getDashboard);
router.post("/pembelian", authenticate, requireRole("pembeli"), usersController.createPembelian);
router.get("/pembelian", authenticate, requireRole("pembeli"), usersController.listMyPembelian);
router.get("/pembelian/:id", authenticate, requireRole("pembeli"), usersController.getMyPembelianById);

router.get("/produk", usersController.listProduk);
router.get("/produk/:id_produk", usersController.getProdukById);
router.get("/artikel", usersController.listArtikelPublik);
router.get("/artikel/:id", usersController.getArtikelPublikById);

module.exports = router;
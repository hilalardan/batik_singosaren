// backend/middlewares/index.js

const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.json({
      success: false,
      message: "Token tidak ditemukan",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    console.error("JWT VERIFY ERROR:", err.message);

    return res.json({
      success: false,
      message: "Token tidak valid atau kedaluwarsa",
      error: err.message,
    });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.json({
        success: false,
        message: "Akses ditolak",
      });
    }

    next();
  };
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images");
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const middlewareUploadGambar = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).single("gambar");

const sendHasilUpload = (req, res) => {
  if (!req.file) {
    return res.json({
      success: false,
      message: "Tidak ada file yang diupload",
    });
  }

  res.json({
    success: true,
    message: "Upload berhasil",
    path: `/uploads/images/${req.file.filename}`,
  });
};

module.exports = {
  authenticate,
  requireRole,
  middlewareUploadGambar,
  sendHasilUpload,
};

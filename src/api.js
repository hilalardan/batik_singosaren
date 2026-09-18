export const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export function authHeaders() {
  const token = localStorage.getItem("toko_token");

  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
}

export async function apiRequest(path, options = {}) {
  const url = path.startsWith("http")
    ? path
    : `${API_BASE}${path}`;

  const headers = {
    "Content-Type": "application/json",
    ...authHeaders(),
    ...options.headers,
  };

  let res;

  try {
    res = await fetch(url, {
      ...options,
      headers,
    });
  } catch {
    throw new Error(
      "Backend tidak jalan. Jalankan backend di port 5000."
    );
  }

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(
      body.message || "Permintaan gagal"
    );

    err.status = res.status;
    err.body = body;

    throw err;
  }

  return body;
}

async function uploadGambar(endpoint, file) {
  const fd = new FormData();
  fd.append("gambar", file);

  let res;

  try {
    res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: authHeaders(),
      body: fd,
    });
  } catch {
    throw new Error(
      "Backend tidak jalan. Jalankan backend di port 5000."
    );
  }

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(
      body.message || "Upload gagal"
    );

    err.status = res.status;
    throw err;
  }

  return body;
}


/* =========================
   API PUBLIK + LOGIN
========================= */

export const api = {
  // Produk publik
  getProduk: () =>
    apiRequest("/api/produk"),

  getProdukById: (id) =>
    apiRequest(`/api/produk/${id}`),

  // Kategori publik
  getKategori: () =>
    apiRequest("/api/kategori"),

  // Artikel publik
  getArtikel: () =>
    apiRequest("/api/artikel"),

  getArtikelById: (id) =>
    apiRequest(`/api/artikel/${id}`),

  // Login
  login: (credential, passwd) =>
    apiRequest("/api/users/login", {
      method: "POST",
      body: JSON.stringify({
        credential,
        passwd,
      }),
    }),

  // Register
  register: (payload) =>
    apiRequest("/api/users/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Profile pembeli
  getPembeliMe: () =>
    apiRequest("/api/users/me"),

  // Profile admin
  getAdminMe: () =>
    apiRequest("/api/admin/me"),
};


/* =========================
   API ADMIN
========================= */

export const adminApi = {
  getStats: () =>
    apiRequest("/api/admin/stats"),

  getMe: () =>
    apiRequest("/api/admin/me"),

  putMe: (payload) =>
    apiRequest("/api/admin/me", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  getPembeli: () =>
    apiRequest("/api/admin/pembeli"),

  getUsers: (role) =>
    apiRequest(
      `/api/admin/users${role ? `?role=${role}` : ""}`
    ),

  getUser: (id) =>
    apiRequest(`/api/admin/users/${id}`),

  createUser: (payload) =>
    apiRequest("/api/admin/users", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateUser: (id, payload) =>
    apiRequest(`/api/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteUser: (id) =>
    apiRequest(`/api/admin/users/${id}`, {
      method: "DELETE",
    }),


  // =========================
  // PRODUK ADMIN
  // =========================

  getProduk: () =>
    apiRequest("/api/admin/produk"),

  getProdukById: (id) =>
    apiRequest(`/api/admin/produk/${id}`),

  createProduk: (payload) =>
    apiRequest("/api/admin/produk", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateProduk: (id, payload) =>
    apiRequest(`/api/admin/produk/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteProduk: (id) =>
    apiRequest(`/api/admin/produk/${id}`, {
      method: "DELETE",
    }),


  // =========================
  // ARTIKEL ADMIN
  // =========================

  getArtikel: () =>
    apiRequest("/api/admin/artikel"),

  getArtikelById: (id) =>
    apiRequest(`/api/admin/artikel/${id}`),

  createArtikel: (payload) =>
    apiRequest("/api/admin/artikel", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateArtikel: (id, payload) =>
    apiRequest(`/api/admin/artikel/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteArtikel: (id) =>
    apiRequest(`/api/admin/artikel/${id}`, {
      method: "DELETE",
    }),


  // =========================
  // PEMBELIAN ADMIN
  // =========================

  getPembelian: () =>
    apiRequest("/api/admin/pembelian"),

  getPembelianById: (id) =>
    apiRequest(`/api/admin/pembelian/${id}`),

  updatePembelian: (id, payload) =>
    apiRequest(`/api/admin/pembelian/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deletePembelian: (id) =>
    apiRequest(`/api/admin/pembelian/${id}`, {
      method: "DELETE",
    }),


  // =========================
  // KATEGORI ADMIN
  // =========================

  getKategori: () =>
    apiRequest("/api/admin/kategori"),

  getKategoriById: (id) =>
    apiRequest(`/api/admin/kategori/${id}`),

  createKategori: (payload) =>
    apiRequest("/api/admin/kategori", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateKategori: (id, payload) =>
    apiRequest(`/api/admin/kategori/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteKategori: (id) =>
    apiRequest(`/api/admin/kategori/${id}`, {
      method: "DELETE",
    }),


  // =========================
  // UPLOAD GAMBAR
  // =========================

  uploadGambar: (file) =>
    uploadGambar("/api/admin/upload-gambar", file),
};


/* =========================
   API PEMBELI
========================= */

export const pembeliApi = {
  getDashboard: () =>
    apiRequest("/api/users/dashboard"),

  getMe: () =>
    apiRequest("/api/users/me"),

  putMe: (payload) =>
    apiRequest("/api/users/me", {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  getProduk: () =>
    apiRequest("/api/produk"),

  getProdukById: (id) =>
    apiRequest(`/api/produk/${id}`),

  getPembelian: () =>
    apiRequest("/api/users/pembelian"),

  getPembelianById: (id) =>
    apiRequest(`/api/users/pembelian/${id}`),

  createPembelian: (payload) =>
    apiRequest("/api/users/pembelian", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  uploadGambar: (file) =>
    uploadGambar("/api/users/upload-gambar", file),
};
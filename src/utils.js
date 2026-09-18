const API_URL = "https://batiksingosaren-production.up.railway.app";

export const mediaUrl = (gambar) => {
  if (!gambar) return null;

  // Jika sudah berupa URL lengkap
  if (gambar.startsWith("http")) {
    return gambar;
  }

  // Jika path berasal dari backend
  // Contoh: /uploads/images/1789456499632.jfif
  if (gambar.startsWith("/")) {
    return `${API_URL}${gambar}`;
  }

  // Jika hanya nama file/path relatif
  return `${API_URL}/uploads/${gambar}`;
};

export const onImgError = (e) => {
  e.target.style.display = "none";
};

export const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka || 0);
};

export const formatTanggal = (tanggal) => {
  if (!tanggal) return "-";

  return new Date(tanggal).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

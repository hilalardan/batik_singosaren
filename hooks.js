
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

// ===============================
// DATA BERANDA
// ===============================

export const useBerandaData = () => {
  const [produkTerbaru, setProdukTerbaru] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);

  useEffect(() => {
    const ambilData = async () => {
      try {
        // ===============================
        // AMBIL PRODUK
        // ===============================

        const produkRes = await fetch(`${API_URL}/api/produk`);
        const produkJson = await produkRes.json();

        const produk = Array.isArray(produkJson.data)
          ? produkJson.data
          : [];

        setProdukTerbaru(produk.slice(0, 3));

        // ===============================
        // AMBIL KATEGORI
        // ===============================

        const kategoriRes = await fetch(
          `${API_URL}/api/kategori`
        );

        const kategoriJson = await kategoriRes.json();

        const kategori = Array.isArray(kategoriJson.data)
          ? kategoriJson.data
          : [];

        console.log("DATA KATEGORI:", kategori);

        setKategoriList(kategori);
      } catch (error) {
        console.error(
          "Gagal mengambil data beranda:",
          error
        );
      }
    };

    ambilData();
  }, []);

  return {
    produkTerbaru,
    kategoriList,
  };
};

// ===============================
// ADMIN GUARD
// ===============================

export const useAdminGuard = () => {
  const navigate = useNavigate();

  const handleError = useCallback(
    (err) => {
      const status = err?.status;

      if (status === 401 || status === 403) {
        localStorage.removeItem("toko_token");
        navigate("/login");
        return true;
      }

      return false;
    },
    [navigate]
  );

  return {
    handleError,
  };
};
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { mediaUrl, onImgError } from "../utils";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [produk, setProduk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/produk/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Produk tidak ditemukan");
        }

        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setProduk(data.data);
        } else {
          setError("Produk tidak ditemukan");
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Produk tidak ditemukan");
        setLoading(false);
      });
  }, [id]);

  const tambahKeKeranjang = () => {
    // Cek apakah user sudah login
    const token = localStorage.getItem("toko_token");

    if (!token) {
      navigate("/login");
      return;
    }

    const keranjangLama = JSON.parse(
      localStorage.getItem("keranjang") || "[]"
    );

    const produkLama = keranjangLama.find(
      (item) => item.id_produk === produk.id_produk
    );

    let keranjangBaru;

    if (produkLama) {
      keranjangBaru = keranjangLama.map((item) =>
        item.id_produk === produk.id_produk
          ? {
              ...item,
              jumlah: item.jumlah + 1,
            }
          : item
      );
    } else {
      keranjangBaru = [
        ...keranjangLama,
        {
          id_produk: produk.id_produk,
          nama_produk: produk.nama_produk,
          harga: Number(produk.harga),
          gambar: produk.gambar,
          kategori: produk.kategori,
          jumlah: 1,
        },
      ];
    }

    localStorage.setItem(
      "keranjang",
      JSON.stringify(keranjangBaru)
    );

    alert("Produk berhasil ditambahkan ke keranjang!");

    // Masuk ke keranjang user
    navigate("/user/cart");
  };

  return (
    <section className="py-5">
      <div className="container">

        <Link
          to="/toko"
          className="btn btn-outline-dark mb-4"
        >
          ← Kembali ke Toko
        </Link>

        {loading && (
          <div className="text-center py-5">
            <p className="text-muted">
              Memuat produk...
            </p>
          </div>
        )}

        {error && (
          <div className="text-center py-5">
            <p className="text-danger">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && produk && (
          <div className="row g-5">

            {/* GAMBAR PRODUK */}
            <div className="col-md-6">
              <div className="rounded-4 overflow-hidden shadow-sm">
                <img
                  src={mediaUrl(produk.gambar)}
                  onError={onImgError}
                  alt={produk.nama_produk}
                  className="w-100"
                  style={{
                    height: "450px",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>

            {/* DETAIL PRODUK */}
            <div className="col-md-6">

              <span className="badge bg-warning text-dark mb-3">
                {produk.kategori}
              </span>

              <h1 className="fw-bold mb-3">
                {produk.nama_produk}
              </h1>

              <p className="text-muted mb-4">
                {produk.deskripsi}
              </p>

              <h2 className="fw-bold text-warning mb-4">
                Rp {Number(produk.harga).toLocaleString("id-ID")}
              </h2>

              <button
                onClick={tambahKeKeranjang}
                className="btn btn-warning btn-lg px-4"
              >
                🛒 Tambah ke Keranjang
              </button>

              <Link
                to="/user/cart"
                className="btn btn-outline-dark btn-lg px-4 ms-2"
              >
                Lihat Keranjang
              </Link>

            </div>
          </div>
        )}

      </div>
    </section>
  );
}

export default ProductDetailPage;

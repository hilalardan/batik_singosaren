import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { mediaUrl, onImgError } from "../utils";
import { api } from "../api";

function Toko() {
  const [produk, setProduk] = useState([]);
  const [kategoriList, setKategoriList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pencarian, setPencarian] = useState("");
  const [kategori, setKategori] = useState("Semua");

  useEffect(() => {
    fetch("http://localhost:5000/api/produk")
      .then((res) => res.json())
      .then((data) => {
        setProduk(Array.isArray(data.data) ? data.data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Gagal mengambil produk:", error);
        setLoading(false);
      });

    api
      .getKategori()
      .then((data) => {
        setKategoriList(
          Array.isArray(data.data) ? data.data : []
        );
      })
      .catch((error) => {
        console.error("Gagal mengambil kategori:", error);
      });
  }, []);

  const produkFilter = produk.filter((item) => {
    const cocokNama = item.nama_produk
      .toLowerCase()
      .includes(pencarian.toLowerCase());

    const cocokKategori =
      kategori === "Semua" || item.kategori === kategori;

    return cocokNama && cocokKategori;
  });

  return (
    <section className="py-5">
      <div className="container">

        <div className="text-center mb-4">
          <p className="text-warning fw-bold mb-1">
            KOLEKSI BATIK
          </p>

          <h2 className="fw-bold">
            Toko Batik Singosaren
          </h2>

          <p className="text-muted">
            Temukan berbagai pilihan batik berkualitas dari Batik Singosaren.
          </p>
        </div>

        <div className="row justify-content-center mb-5">

          <div className="col-md-6 mb-3 mb-md-0">
            <input
              type="text"
              className="form-control"
              placeholder="Cari produk batik..."
              value={pencarian}
              onChange={(e) => setPencarian(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <select
              className="form-select"
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
            >
              <option value="Semua">
                Semua Kategori
              </option>

              {kategoriList.map((item) => (
                <option
                  key={item.id_kategori}
                  value={item.nama_kategori}
                >
                  {item.nama_kategori}
                </option>
              ))}
            </select>
          </div>

        </div>

        {loading ? (
          <div className="text-center py-5">
            <p>Memuat produk...</p>
          </div>
        ) : produk.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">
              Belum ada produk.
            </p>
          </div>
        ) : produkFilter.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">
              Produk tidak ditemukan.
            </p>
          </div>
        ) : (
          <div className="row">
            {produkFilter.map((item) => (
              <div
                className="col-md-4 col-lg-3 mb-4"
                key={item.id_produk}
              >
                <div className="card border-0 shadow-sm h-100">

                  {/* GAMBAR */}
                  {item.gambar && (
                    <img
                      src={mediaUrl(item.gambar)}
                      onError={onImgError}
                      className="card-img-top"
                      alt={item.nama_produk}
                      style={{
                        height: "230px",
                        objectFit: "cover",
                      }}
                    />
                  )}

                  <div className="card-body d-flex flex-column">

                    <p className="text-warning small fw-bold mb-1">
                      {item.kategori}
                    </p>

                    <h5 className="fw-bold">
                      {item.nama_produk}
                    </h5>

                    <p className="text-muted small">
                      {item.deskripsi}
                    </p>

                    <h6 className="fw-bold text-warning mt-auto mb-3">
                      Rp {Number(item.harga).toLocaleString("id-ID")}
                    </h6>

                    <Link
                      to={`/produk/${item.id_produk}`}
                      className="btn btn-outline-dark w-100"
                    >
                      Lihat Detail
                    </Link>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default Toko;
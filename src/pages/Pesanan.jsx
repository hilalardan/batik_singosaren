
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pembeliApi } from "../api";
import {
  mediaUrl,
  onImgError,
  formatTanggal,
  formatRupiah,
} from "../utils";

function Pesanan() {
  const [pesanan, setPesanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("toko_token");

    if (!token) {
      setError("Silakan login terlebih dahulu.");
      setLoading(false);
      return;
    }

    pembeliApi
      .getPembelian()
      .then((response) => {
        if (response.success) {
          setPesanan(
            Array.isArray(response.data)
              ? response.data
              : []
          );
        } else {
          setError(
            response.message ||
              "Gagal mengambil data pesanan."
          );
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil pesanan:", err);
        setError("Gagal mengambil data pesanan.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getStatus = (item) => {
    return (
      item.status ||
      item.status_proses ||
      item.status_pesanan ||
      "Tertunda"
    );
  };

  const getStatusClass = (status) => {
    const statusLower = String(status).toLowerCase();

    if (
      statusLower === "selesai" ||
      statusLower === "diterima"
    ) {
      return "user-status user-status-success";
    }

    if (statusLower === "dikirim") {
      return "user-status user-status-primary";
    }

    if (statusLower === "dikemas") {
      return "user-status user-status-info";
    }

    if (
      statusLower === "dibatalkan" ||
      statusLower === "batal"
    ) {
      return "user-status user-status-danger";
    }

    return "user-status user-status-warning";
  };

  const getTanggal = (item) => {
    return formatTanggal(
      item.created_at ||
        item.tanggal_pembelian ||
        item.createdAt
    );
  };

  return (
    <div className="user-dashboard">

      <div className="user-dashboard-welcome">
        <div>
          <span className="user-dashboard-label">
            PESANAN SAYA
          </span>

          <h2>Riwayat Pesanan</h2>

          <p>
            Lihat dan pantau semua pesanan yang sudah kamu buat.
          </p>
        </div>

        <Link
          to="/user/toko"
          className="user-shop-button"
        >
          <i className="bi bi-shop me-2"></i>
          Belanja Lagi
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-circle me-2"></i>
          {error}
        </div>
      )}

      {loading ? (
        <div className="user-dashboard-card">
          <div className="user-empty">
            <i className="bi bi-hourglass-split"></i>

            <p className="mt-2 mb-0">
              Memuat pesanan...
            </p>
          </div>
        </div>
      ) : pesanan.length === 0 ? (
        <div className="user-dashboard-card">
          <div className="user-empty">

            <div className="user-empty-icon">
              <i className="bi bi-bag"></i>
            </div>

            <h5>Belum Ada Pesanan</h5>

            <p>
              Kamu belum memiliki pesanan.
              Yuk, lihat koleksi batik kami.
            </p>

            <Link
              to="/user/toko"
              className="btn btn-dark"
            >
              <i className="bi bi-shop me-2"></i>
              Mulai Belanja
            </Link>

          </div>
        </div>
      ) : (
        <div className="user-dashboard-card">

          <div className="user-dashboard-card-header">
            <div>
              <h4>Daftar Pesanan</h4>

              <p>
                {pesanan.length} pesanan ditemukan
              </p>
            </div>
          </div>

          <div className="pesanan-list">

            {pesanan.map((item) => {
              const statusPesanan = getStatus(item);

              return (
                <div
                  className="pesanan-item"
                  key={item.id_pembelian}
                >

                  <div className="pesanan-product">

                    <div className="pesanan-image">

                      {item.gambar_produk ? (
                        <img
                          src={mediaUrl(item.gambar_produk)}
                          onError={onImgError}
                          alt={
                            item.nama_produk ||
                            "Produk Batik"
                          }
                        />
                      ) : (
                        <i className="bi bi-image"></i>
                      )}

                    </div>

                    <div className="pesanan-product-info">

                      <span className="pesanan-label">
                        PRODUK
                      </span>

                      <h5>
                        {item.nama_produk ||
                          "Produk Batik"}
                      </h5>

                      <p>
                        {item.jumlah || 1} barang
                      </p>

                    </div>

                  </div>

                  <div className="pesanan-info">

                    <span>Tanggal</span>

                    <strong>
                      {getTanggal(item)}
                    </strong>

                  </div>

                  <div className="pesanan-info">

                    <span>Harga</span>

                    <strong>
                      {formatRupiah(
                        Number(item.harga || 0) *
                          Number(item.jumlah || 1)
                      )}
                    </strong>

                  </div>

                  <div className="pesanan-status">

                    <span className="pesanan-status-label">
                      Status
                    </span>

                    <span
                      className={getStatusClass(
                        statusPesanan
                      )}
                    >
                      {statusPesanan}
                    </span>

                  </div>

                  <div className="pesanan-action">

                    <span className="pesanan-detail-button">
                      <i className="bi bi-receipt me-2"></i>
                      Pesanan
                    </span>

                  </div>

                </div>
              );
            })}

          </div>

        </div>
      )}

    </div>
  );
}

export default Pesanan;

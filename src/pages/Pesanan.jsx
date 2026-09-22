
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
  const [selectedPesanan, setSelectedPesanan] = useState(null);

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

  const getTotal = (item) => {
    if (
      item.total !== undefined &&
      item.total !== null
    ) {
      return Number(item.total);
    }

    return (
      Number(item.harga || 0) *
      Number(item.jumlah || 1)
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

                    <button
                      type="button"
                      className="pesanan-detail-button border-0"
                      onClick={() =>
                        setSelectedPesanan(item)
                      }
                    >
                      <i className="bi bi-receipt me-2"></i>
                      Rincian
                    </button>

                  </div>

                </div>
              );
            })}

          </div>

        </div>
      )}

      {/* MODAL RINCIAN PESANAN */}
      {selectedPesanan && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">
                  Rincian Pesanan
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() =>
                    setSelectedPesanan(null)
                  }
                ></button>
              </div>

              <div className="modal-body">

                <div className="text-center mb-4">
                  <div
                    className="mx-auto rounded overflow-hidden"
                    style={{
                      width: "120px",
                      height: "120px",
                    }}
                  >
                    {selectedPesanan.gambar_produk ? (
                      <img
                        src={mediaUrl(
                          selectedPesanan.gambar_produk
                        )}
                        onError={onImgError}
                        alt={
                          selectedPesanan.nama_produk ||
                          "Produk Batik"
                        }
                        className="w-100 h-100"
                        style={{
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                        <i className="bi bi-image fs-1 text-muted"></i>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <small className="text-muted">
                    Produk
                  </small>

                  <div className="fw-semibold">
                    {selectedPesanan.nama_produk ||
                      "Produk Batik"}
                  </div>
                </div>

                <div className="row g-3">

                  <div className="col-6">
                    <small className="text-muted">
                      Jumlah
                    </small>

                    <div className="fw-semibold">
                      {selectedPesanan.jumlah || 1} barang
                    </div>
                  </div>

                  <div className="col-6">
                    <small className="text-muted">
                      Harga
                    </small>

                    <div className="fw-semibold">
                      {formatRupiah(
                        selectedPesanan.harga || 0
                      )}
                    </div>
                  </div>

                  <div className="col-6">
                    <small className="text-muted">
                      Tanggal
                    </small>

                    <div className="fw-semibold">
                      {getTanggal(selectedPesanan)}
                    </div>
                  </div>

                  <div className="col-6">
                    <small className="text-muted">
                      Total
                    </small>

                    <div className="fw-bold">
                      {formatRupiah(
                        getTotal(selectedPesanan)
                      )}
                    </div>
                  </div>

                  <div className="col-6">
                    <small className="text-muted">
                      Pembayaran
                    </small>

                    <div className="fw-semibold">
                      {selectedPesanan.metode_pembayaran ||
                        "-"}
                    </div>
                  </div>

                  <div className="col-6">
                    <small className="text-muted">
                      Pengiriman
                    </small>

                    <div className="fw-semibold">
                      {selectedPesanan.pengiriman ||
                        "-"}
                    </div>
                  </div>

                </div>

                <hr />

                <div className="d-flex justify-content-between align-items-center">

                  <span className="text-muted">
                    Status Pesanan
                  </span>

                  <span
                    className={getStatusClass(
                      getStatus(selectedPesanan)
                    )}
                  >
                    {getStatus(selectedPesanan)}
                  </span>

                </div>

              </div>

              <div className="modal-footer">

                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() =>
                    setSelectedPesanan(null)
                  }
                >
                  Tutup
                </button>

              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Pesanan;

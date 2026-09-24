import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pembeliApi } from "../api";
import { mediaUrl, onImgError, formatTanggal } from "../utils";

function UserDashboard() {
  const [pesanan, setPesanan] = useState([]);
  const [stats, setStats] = useState({
    total_pembelian: 0,
    total_tertunda: 0,
    total_dikemas: 0,
    total_dikirim: 0,
    total_diterima: 0,
    total_selesai: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("toko_token");

    if (!token) {
      setLoading(false);
      return;
    }

    Promise.all([
      pembeliApi.getDashboard(),
      pembeliApi.getPembelian(),
    ])
      .then(([dashboardResponse, pesananResponse]) => {
        console.log("DATA DASHBOARD:", dashboardResponse);
        console.log("DATA PESANAN:", pesananResponse);

        if (dashboardResponse.success) {
          setStats(
            dashboardResponse.data || {
              total_pembelian: 0,
              total_tertunda: 0,
              total_dikemas: 0,
              total_dikirim: 0,
              total_diterima: 0,
              total_selesai: 0,
            }
          );
        }

        if (pesananResponse.success) {
          setPesanan(pesananResponse.data || []);
        }
      })
      .catch((error) => {
        console.error("Gagal mengambil data dashboard:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const jumlahPesanan = Number(stats.total_pembelian || 0);

  const jumlahDiproses =
    Number(stats.total_tertunda || 0) +
    Number(stats.total_dikemas || 0) +
    Number(stats.total_dikirim || 0);

  const jumlahSelesai =
    Number(stats.total_diterima || 0) +
    Number(stats.total_selesai || 0);

  const pesananTerbaru = pesanan.slice(0, 5);

  const getStatusClass = (status) => {
    if (status === "Selesai" || status === "Diterima") {
      return "user-status user-status-success";
    }

    if (status === "Dikirim") {
      return "user-status user-status-primary";
    }

    if (status === "Dikemas") {
      return "user-status user-status-info";
    }

    return "user-status user-status-warning";
  };

  return (
    <div className="user-dashboard">

      {/* HEADER DASHBOARD */}
      <div className="user-dashboard-welcome">

        <div>
          <span className="user-dashboard-label">
            DASHBOARD PEMBELI
          </span>

          <h2>
            Selamat Datang 👋
          </h2>

          <p>
            Kelola belanja dan lihat perkembangan pesanan kamu
            melalui halaman ini.
          </p>
        </div>

        <Link
          to="/user/toko"
          className="user-shop-button"
        >
          <i className="bi bi-shop"></i>
          Belanja Sekarang
        </Link>

      </div>

      {/* STATISTIK */}
      <div className="row g-4 mb-4">

        <div className="col-md-4">
          <div className="user-stat-card">

            <div className="user-stat-icon">
              <i className="bi bi-bag-check"></i>
            </div>

            <div>
              <span>Total Pesanan</span>

              <h3>
                {loading ? "..." : jumlahPesanan}
              </h3>

              <small>
                Semua pesanan kamu
              </small>
            </div>

          </div>
        </div>

        <div className="col-md-4">
          <div className="user-stat-card">

            <div className="user-stat-icon">
              <i className="bi bi-box-seam"></i>
            </div>

            <div>
              <span>Sedang Diproses</span>

              <h3>
                {loading ? "..." : jumlahDiproses}
              </h3>

              <small>
                Pesanan yang belum selesai
              </small>
            </div>

          </div>
        </div>

        <div className="col-md-4">
          <div className="user-stat-card">

            <div className="user-stat-icon">
              <i className="bi bi-check-circle"></i>
            </div>

            <div>
              <span>Pesanan Selesai</span>

              <h3>
                {loading ? "..." : jumlahSelesai}
              </h3>

              <small>
                Pesanan yang telah selesai
              </small>
            </div>

          </div>
        </div>

      </div>

      {/* PESANAN TERBARU */}
      <div className="user-dashboard-card">

        <div className="user-dashboard-card-header">

          <div>
            <h4>Pesanan Terbaru</h4>

            <p>
              Daftar pesanan terakhir kamu
            </p>
          </div>

          <Link to="/user/pesanan">
            Lihat Semua
            <i className="bi bi-arrow-right ms-2"></i>
          </Link>

        </div>

        {loading ? (
          <div className="user-empty">

            <i className="bi bi-hourglass-split"></i>

            <p>
              Memuat pesanan...
            </p>

          </div>
        ) : pesananTerbaru.length === 0 ? (
          <div className="user-empty">

            <div className="user-empty-icon">
              <i className="bi bi-bag"></i>
            </div>

            <h5>
              Belum Ada Pesanan
            </h5>

            <p>
              Kamu belum memiliki pesanan.
              Yuk, lihat koleksi batik kami.
            </p>

            <Link
              to="/user/toko"
              className="btn btn-dark"
            >
              Mulai Belanja
            </Link>

          </div>
        ) : (
          <div className="user-order-list">

            {pesananTerbaru.map((item) => (

              <div
                className="user-order-item"
                key={item.id_pembelian || item.id}
              >

                <div className="user-order-product">

                  <div className="user-order-image">

                    {item.gambar_produk ? (
                      <img
                        src={mediaUrl(item.gambar_produk)}
                        onError={onImgError}
                        alt={item.nama_produk}
                      />
                    ) : (
                      <i className="bi bi-image"></i>
                    )}

                  </div>

                  <div>
                    <h5>
                      {item.nama_produk || "Produk Batik"}
                    </h5>

                    <p>
                      {item.jumlah || 1} barang
                    </p>
                  </div>

                </div>

                <div className="user-order-date">

                  <span>
                    Tanggal
                  </span>

                  <strong>
                    {formatTanggal(
                      item.created_at ||
                      item.tanggal_pembelian ||
                      item.createdAt
                    )}
                  </strong>

                </div>

                <div>
                  <span className={getStatusClass(item.status)}>
                    {item.status || "Tertunda"}
                  </span>
                </div>

              </div>

            ))}

          </div>
        )}

      </div>

      {/* MENU CEPAT */}
      <div className="row g-4 mt-1">

        <div className="col-md-6">

          <Link
            to="/user/toko"
            className="user-quick-card"
          >

            <div className="user-quick-icon">
              <i className="bi bi-shop"></i>
            </div>

            <div>
              <h5>
                Jelajahi Koleksi Batik
              </h5>

              <p>
                Temukan berbagai batik pilihan dari Batik Singosaren.
              </p>
            </div>

            <i className="bi bi-arrow-right user-quick-arrow"></i>

          </Link>

        </div>

        <div className="col-md-6">

          <Link
            to="/user/cart"
            className="user-quick-card"
          >

            <div className="user-quick-icon">
              <i className="bi bi-cart3"></i>
            </div>

            <div>
              <h5>
                Periksa Keranjang
              </h5>

              <p>
                Lihat kembali produk yang sudah kamu pilih.
              </p>
            </div>

            <i className="bi bi-arrow-right user-quick-arrow"></i>

          </Link>

        </div>

      </div>

    </div>
  );
}

export default UserDashboard;

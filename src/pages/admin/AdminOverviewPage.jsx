import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi, apiRequest } from "../../api";
import { useAdminGuard } from "../../hooks";
import { formatRupiah, formatTanggal } from "../../utils";

export default function AdminOverviewPage() {
  const { handleError } = useAdminGuard();

  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [grafik, setGrafik] = useState([]);
  const [jumlahPembeli, setJumlahPembeli] = useState(0);
  const [jumlahProduk, setJumlahProduk] = useState(0);
  const [pesan, setPesan] = useState("");

  useEffect(() => {
    Promise.all([
      adminApi.getStats(),
      adminApi.getPembeli(),
      adminApi.getProduk(),
    ])
      .then(([resStats, resPembeli, resProduk]) => {
        if (!resStats?.success) {
          throw new Error(
            resStats?.message || "Gagal mengambil statistik"
          );
        }

        if (!resPembeli?.success) {
          throw new Error(
            resPembeli?.message || "Gagal mengambil data pembeli"
          );
        }

        if (!resProduk?.success) {
          throw new Error(
            resProduk?.message || "Gagal mengambil data produk"
          );
        }

        setStats(resStats.data?.stats || {});
        setRecent(resStats.data?.recent || []);

        setJumlahPembeli(
          Array.isArray(resPembeli.data)
            ? resPembeli.data.length
            : 0
        );

        setJumlahProduk(
          Array.isArray(resProduk.data)
            ? resProduk.data.length
            : 0
        );
      })
      .catch((err) => {
        if (!handleError(err)) {
          setPesan(
            err.message || "Gagal mengambil data dashboard"
          );
        }
      });
  }, [handleError]);

  // ========================================
  // DATA GRAFIK PENJUALAN
  // ========================================

  useEffect(() => {
    apiRequest("/api/admin/grafik-penjualan")
      .then((res) => {
        if (res?.success) {
          setGrafik(
            Array.isArray(res.data)
              ? res.data
              : []
          );
        }
      })
      .catch((err) => {
        console.error(
          "Gagal mengambil grafik:",
          err
        );
      });
  }, []);

  if (pesan) {
    return (
      <div className="alert alert-danger">
        <i className="bi bi-exclamation-circle me-2"></i>
        {pesan}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-secondary mb-3"></div>

        <p className="text-muted mb-0">
          Memuat data dashboard...
        </p>
      </div>
    );
  }

  const pesananAktif =
    Number(stats.total_tertunda || 0) +
    Number(stats.total_dikemas || 0) +
    Number(stats.total_dikirim || 0);

  const belumDibayar = recent.filter(
    (r) => r.pembayaran === "Belum"
  ).length;

  const kartu = [
    {
      label: "Pembeli Terdaftar",
      value: jumlahPembeli,
      icon: "bi-people",
      warna: "",
    },
    {
      label: "Total Transaksi",
      value: stats.total_pembelian || 0,
      icon: "bi-receipt",
      warna: "dark",
    },
    {
      label: "Produk di Katalog",
      value: jumlahProduk,
      icon: "bi-box-seam",
      warna: "",
    },
    {
      label: "Produk Terjual",
      value: stats.total_pembelian || 0,
      icon: "bi-bag-check",
      warna: "",
    },
    {
      label: "Pesanan Aktif",
      value: pesananAktif,
      icon: "bi-clock-history",
      warna: "red",
    },
    {
      label: "Belum Dibayar",
      value: belumDibayar,
      icon: "bi-credit-card",
      warna: "red",
    },
  ];

  const statusPesanan = [
    {
      label: "Tertunda",
      value: Number(stats.total_tertunda || 0),
      icon: "bi-hourglass-split",
    },
    {
      label: "Dikemas",
      value: Number(stats.total_dikemas || 0),
      icon: "bi-box-seam",
    },
    {
      label: "Dikirim",
      value: Number(stats.total_dikirim || 0),
      icon: "bi-truck",
    },
    {
      label: "Diterima",
      value: Number(stats.total_diterima || 0),
      icon: "bi-check2-circle",
    },
    {
      label: "Selesai",
      value: Number(stats.total_selesai || 0),
      icon: "bi-check-circle",
    },
  ];

  // ========================================
  // FORMAT BULAN GRAFIK
  // ========================================

  const formatBulan = (bulan) => {
    const [tahun, bulanKe] = String(bulan).split("-");

    return new Date(
      Number(tahun),
      Number(bulanKe) - 1,
      1
    ).toLocaleDateString("id-ID", {
      month: "short",
      year: "numeric",
    });
  };

  // Ambil maksimal 6 bulan terakhir
  const dataGrafik = grafik.slice(-6);

  const maxGrafik = Math.max(
    ...dataGrafik.map(
      (item) => Number(item.total || 0)
    ),
    1
  );

  return (
    <div>

      {/* HEADER DASHBOARD */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h4 className="fw-bold mb-1">
            Dashboard
          </h4>

          <p className="text-muted mb-0">
            Ringkasan aktivitas toko Batik Singosaren
          </p>
        </div>

        <div className="small text-muted">
          <i className="bi bi-shop me-1"></i>
          Admin Batik Singosaren
        </div>
      </div>

      {/* KARTU STATISTIK */}
      <div className="row g-3 mb-4">
        {kartu.map((k) => (
          <div
            className="col-6 col-md-4 col-xl-2"
            key={k.label}
          >
            <div
              className={`adm-stat-card h-100 ${
                k.warna
                  ? `adm-stat-card--${k.warna}`
                  : ""
              }`}
            >
              <div className="d-flex justify-content-between align-items-start mb-3">

                <p className="adm-stat-label mb-0">
                  {k.label}
                </p>

                <div
                  className="rounded-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "38px",
                    height: "38px",
                    background:
                      "rgba(82, 100, 86, 0.10)",
                  }}
                >
                  <i
                    className={`bi ${k.icon}`}
                    style={{
                      fontSize: "18px",
                    }}
                  ></i>
                </div>

              </div>

              <div className="adm-stat-value">
                {k.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PENDAPATAN */}
      <div className="adm-card mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

          <div className="d-flex align-items-center gap-3">

            <div
              className="rounded-3 d-flex align-items-center justify-content-center"
              style={{
                width: "50px",
                height: "50px",
                background: "#e8f0ea",
                color: "#526456",
              }}
            >
              <i className="bi bi-cash-stack fs-4"></i>
            </div>

            <div>
              <p className="text-muted mb-1">
                Total Penjualan
              </p>

              <h5 className="fw-bold mb-0">
                Pendapatan dari seluruh pesanan
              </h5>
            </div>

          </div>

          <div className="adm-pendapatan-value">
            {formatRupiah(
              stats.total_pendapatan || 0
            )}
          </div>

        </div>
      </div>

      {/* GRAFIK PENJUALAN */}
      <div className="adm-card mb-4">

        <div className="mb-4">
          <h6 className="fw-bold mb-1">
            Grafik Penjualan
          </h6>

          <p className="text-muted small mb-0">
            Total penjualan berdasarkan bulan
          </p>
        </div>

        {dataGrafik.length === 0 ? (

          <div className="text-center text-muted py-5">

            <i
              className="bi bi-bar-chart"
              style={{
                fontSize: "40px",
                color: "#9aa89d",
              }}
            ></i>

            <p className="mt-3 mb-0">
              Belum ada data penjualan.
            </p>

          </div>

        ) : (

          <div
            className="d-flex align-items-end gap-3 overflow-auto"
            style={{
              minHeight: "280px",
            }}
          >

            {dataGrafik.map((item) => {

              const total = Number(
                item.total || 0
              );

              const tinggi =
                total > 0
                  ? Math.max(
                      (total / maxGrafik) * 100,
                      5
                    )
                  : 0;

              return (
                <div
                  key={item.bulan}
                  className="flex-fill d-flex flex-column align-items-center justify-content-end"
                  style={{
                    minWidth: "90px",
                    height: "260px",
                  }}
                >

                  <small className="fw-semibold mb-2 text-center">
                    {formatRupiah(total)}
                  </small>

                  <div
                    title={`${formatBulan(
                      item.bulan
                    )} - ${formatRupiah(total)}`}
                    style={{
                      width: "55px",
                      height: `${tinggi}%`,
                      background: "#6b4226",
                      borderRadius:
                        "8px 8px 0 0",
                      minHeight:
                        total > 0
                          ? "8px"
                          : "0",
                    }}
                  ></div>

                  <small className="text-muted mt-2">
                    {formatBulan(item.bulan)}
                  </small>

                </div>
              );
            })}

          </div>

        )}

      </div>

      {/* STATUS PESANAN */}
      <div className="adm-card mb-4">

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h6 className="fw-bold mb-1">
              Status Pesanan
            </h6>

            <p className="text-muted small mb-0">
              Ringkasan kondisi pesanan saat ini
            </p>
          </div>

          <Link
            to="/admin/pembelian"
            className="adm-btn-outline"
          >
            Kelola
          </Link>

        </div>

        <div className="row g-3">

          {statusPesanan.map((item) => (
            <div
              className="col-6 col-md"
              key={item.label}
            >
              <div
                className="border rounded-3 p-3 h-100"
                style={{
                  background: "#fafcfb",
                }}
              >

                <div className="d-flex justify-content-between align-items-center mb-2">

                  <span className="text-muted small">
                    {item.label}
                  </span>

                  <i
                    className={`bi ${item.icon}`}
                    style={{
                      color: "#657a68",
                    }}
                  ></i>

                </div>

                <div className="fs-4 fw-bold">
                  {item.value}
                </div>

              </div>
            </div>
          ))}

        </div>
      </div>

      {/* TRANSAKSI TERBARU */}
      <div className="adm-card mb-4">

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">

          <div>
            <h6 className="fw-bold mb-1">
              Transaksi Terbaru
            </h6>

            <p className="text-muted small mb-0">
              Pesanan yang baru masuk ke toko
            </p>
          </div>

          <Link
            to="/admin/pembelian"
            className="adm-btn-outline"
          >
            Lihat semua
            <i className="bi bi-arrow-right ms-2"></i>
          </Link>

        </div>

        {recent.length === 0 ? (

          <div className="text-center py-5">

            <i
              className="bi bi-receipt"
              style={{
                fontSize: "40px",
                color: "#9aa89d",
              }}
            ></i>

            <p className="text-muted mt-3 mb-0">
              Belum ada pesanan.
            </p>

          </div>

        ) : (

          <div className="table-responsive">

            <table className="table adm-table mb-0">

              <thead>
                <tr>
                  <th>Pembeli</th>
                  <th>Produk</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {recent.map((item) => (

                  <tr key={item.id}>

                    <td>
                      <div className="d-flex align-items-center gap-2">

                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          style={{
                            width: "34px",
                            height: "34px",
                            background: "#e8f0ea",
                            color: "#526456",
                          }}
                        >
                          <i className="bi bi-person"></i>
                        </div>

                        <div>
                          <div className="fw-semibold">
                            {item.nama_d}{" "}
                            {item.nama_b}
                          </div>

                          <small className="text-muted">
                            Pesanan #{item.id}
                          </small>
                        </div>

                      </div>
                    </td>

                    <td>
                      {item.nama_produk}
                    </td>

                    <td>
                      {formatTanggal(
                        item.created_at
                      )}
                    </td>

                    <td>
                      <span className="adm-badge">
                        {item.status ||
                          "Tertunda"}
                      </span>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* AKSI CEPAT */}
      <div>

        <h6 className="fw-bold mb-3">
          Aksi Cepat
        </h6>

        <div className="d-flex gap-2 flex-wrap">

          <Link
            to="/admin/produk"
            className="adm-action-btn adm-action-btn--dark"
          >
            <i className="bi bi-plus-lg me-2"></i>
            Tambah Produk
          </Link>

          <Link
            to="/admin/pembelian"
            className="adm-action-btn adm-action-btn--outline"
          >
            <i className="bi bi-bag-check me-2"></i>
            Kelola Pesanan
          </Link>

          <Link
            to="/admin/pembeli"
            className="adm-action-btn adm-action-btn--outline"
          >
            <i className="bi bi-people me-2"></i>
            Data Pembeli
          </Link>

          <Link
            to="/"
            className="adm-action-btn adm-action-btn--outline"
          >
            <i className="bi bi-shop me-2"></i>
            Lihat Toko
          </Link>

        </div>

      </div>

    </div>
  );
}

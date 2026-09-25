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

  // ==============================
  // GRAFIK PENJUALAN
  // ==============================

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

  const dataGrafik = grafik.slice(-6);

  const maxGrafik = Math.max(
    ...dataGrafik.map(
      (item) => Number(item.total || 0)
    ),
    1
  );

  // Ukuran SVG grafik
  const chartWidth = 760;
  const chartHeight = 320;

  const paddingLeft = 75;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 60;

  const plotWidth =
    chartWidth -
    paddingLeft -
    paddingRight;

  const plotHeight =
    chartHeight -
    paddingTop -
    paddingBottom;

  // Membuat titik-titik grafik
  const points = dataGrafik.map(
    (item, index) => {
      const total = Number(
        item.total || 0
      );

      const x =
        dataGrafik.length === 1
          ? paddingLeft + plotWidth / 2
          : paddingLeft +
            (index /
              (dataGrafik.length - 1)) *
              plotWidth;

      const y =
        paddingTop +
        plotHeight -
        (total / maxGrafik) *
          plotHeight;

      return {
        x,
        y,
        total,
        bulan: item.bulan,
      };
    }
  );

  const linePoints = points
    .map(
      (point) =>
        `${point.x},${point.y}`
    )
    .join(" ");

  return (
    <div className="container-fluid py-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">
            Dashboard
          </h3>

          <p className="text-muted mb-0">
            Ringkasan aktivitas toko Batik Singosaren
          </p>
        </div>

        <div className="text-end">
          <span className="text-muted small">
            Admin
          </span>
        </div>
      </div>

      {pesan && (
        <div className="alert alert-danger">
          {pesan}
        </div>
      )}

      {/* STATISTIK */}
      <div className="row g-3 mb-4">

        <div className="col-md-6 col-lg-4">
          <div className="adm-stat-card">
            <div className="adm-stat-label">
              Pembeli Terdaftar
            </div>

            <div className="adm-stat-value">
              {jumlahPembeli}
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="adm-stat-card">
            <div className="adm-stat-label">
              Total Transaksi
            </div>

            <div className="adm-stat-value">
              {stats?.total_transaksi || 0}
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="adm-stat-card">
            <div className="adm-stat-label">
              Produk di Katalog
            </div>

            <div className="adm-stat-value">
              {jumlahProduk}
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="adm-stat-card">
            <div className="adm-stat-label">
              Produk Terjual
            </div>

            <div className="adm-stat-value">
              {stats?.produk_terjual || 0}
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="adm-stat-card">
            <div className="adm-stat-label">
              Pesanan Aktif
            </div>

            <div className="adm-stat-value">
              {stats?.pesanan_aktif || 0}
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="adm-stat-card">
            <div className="adm-stat-label">
              Belum Dibayar
            </div>

            <div className="adm-stat-value">
              {stats?.belum_dibayar || 0}
            </div>
          </div>
        </div>

      </div>

      {/* PENDAPATAN */}
      <div className="adm-card mb-4">
        <div>
          <div className="adm-stat-label">
            Total Pendapatan
          </div>

          <div className="adm-pendapatan-value">
            {formatRupiah(
              stats?.total_pendapatan || 0
            )}
          </div>
        </div>
      </div>

      {/* STATUS PESANAN */}
      <div className="adm-card mb-4">

        <div className="mb-4">
          <h6 className="fw-bold mb-1">
            Status Pesanan
          </h6>

          <p className="text-muted small mb-0">
            Ringkasan status pesanan pelanggan
          </p>
        </div>

        <div className="row g-3">

          <div className="col-6 col-md-3">
            <div className="p-3 rounded bg-light">
              <small className="text-muted">
                Tertunda
              </small>

              <h5 className="fw-bold mt-2 mb-0">
                {stats?.status?.tertunda || 0}
              </h5>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="p-3 rounded bg-light">
              <small className="text-muted">
                Dikemas
              </small>

              <h5 className="fw-bold mt-2 mb-0">
                {stats?.status?.dikemas || 0}
              </h5>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="p-3 rounded bg-light">
              <small className="text-muted">
                Dikirim
              </small>

              <h5 className="fw-bold mt-2 mb-0">
                {stats?.status?.dikirim || 0}
              </h5>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="p-3 rounded bg-light">
              <small className="text-muted">
                Diterima
              </small>

              <h5 className="fw-bold mt-2 mb-0">
                {stats?.status?.diterima || 0}
              </h5>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="p-3 rounded bg-light">
              <small className="text-muted">
                Selesai
              </small>

              <h5 className="fw-bold mt-2 mb-0">
                {stats?.status?.selesai || 0}
              </h5>
            </div>
          </div>

        </div>
      </div>

      {/* ======================================== */}
      {/* GRAFIK PENJUALAN */}
      {/* ======================================== */}

      <div className="adm-card mb-4">

        <div className="mb-4">
          <h6 className="fw-bold mb-1">
            Statistik Penjualan
          </h6>

          <p className="text-muted small mb-0">
            Perkembangan penjualan berdasarkan bulan
          </p>
        </div>

        {dataGrafik.length === 0 ? (

          <div className="text-center text-muted py-5">

            <i
              className="bi bi-graph-up"
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
            className="overflow-auto"
            style={{
              width: "100%",
            }}
          >

            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              width="100%"
              height="320"
              preserveAspectRatio="xMidYMid meet"
              style={{
                minWidth: "650px",
              }}
            >

              {/* GARIS GRID */}
              {Array.from(
                { length: 5 },
                (_, index) => {
                  const nilai =
                    maxGrafik *
                    (1 - index / 4);

                  const y =
                    paddingTop +
                    (plotHeight * index) /
                      4;

                  return (
                    <g key={index}>

                      <line
                        x1={paddingLeft}
                        y1={y}
                        x2={
                          chartWidth -
                          paddingRight
                        }
                        y2={y}
                        stroke="#e5e5e5"
                        strokeWidth="1"
                      />

                      <text
                        x={paddingLeft - 10}
                        y={y + 4}
                        textAnchor="end"
                        fontSize="11"
                        fill="#777"
                      >
                        {formatRupiah(nilai)}
                      </text>

                    </g>
                  );
                }
              )}

              {/* GARIS GRAFIK */}
              {points.length > 1 && (
                <polyline
                  points={linePoints}
                  fill="none"
                  stroke="#6b4226"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* AREA BAWAH GARIS */}
              {points.length > 1 && (
                <polygon
                  points={`
                    ${linePoints}
                    ${points[points.length - 1].x},
                    ${paddingTop + plotHeight}
                    ${points[0].x},
                    ${paddingTop + plotHeight}
                  `}
                  fill="rgba(107, 66, 38, 0.08)"
                />
              )}

              {/* TITIK GRAFIK */}
              {points.map(
                (point, index) => (
                  <g key={index}>

                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="6"
                      fill="#ffffff"
                      stroke="#6b4226"
                      strokeWidth="4"
                    >
                      <title>
                        {formatBulan(
                          point.bulan
                        )}{" "}
                        -{" "}
                        {formatRupiah(
                          point.total
                        )}
                      </title>
                    </circle>

                    {/* NILAI DI ATAS TITIK */}
                    <text
                      x={point.x}
                      y={point.y - 12}
                      textAnchor="middle"
                      fontSize="11"
                      fontWeight="600"
                      fill="#526456"
                    >
                      {formatRupiah(
                        point.total
                      )}
                    </text>

                    {/* LABEL BULAN */}
                    <text
                      x={point.x}
                      y={
                        paddingTop +
                        plotHeight +
                        30
                      }
                      textAnchor="middle"
                      fontSize="11"
                      fill="#777"
                    >
                      {formatBulan(
                        point.bulan
                      )}
                    </text>

                  </g>
                )
              )}

            </svg>

          </div>

        )}

      </div>

      {/* TRANSAKSI TERBARU */}
      <div className="adm-card mb-4">

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h6 className="fw-bold mb-1">
              Transaksi Terbaru
            </h6>

            <p className="text-muted small mb-0">
              Daftar transaksi terbaru
            </p>
          </div>

          <Link
            to="/admin/pesanan"
            className="adm-btn-outline"
          >
            Lihat Semua
          </Link>

        </div>

        <div className="table-responsive">

          <table className="table adm-table align-middle">

            <thead>
              <tr>
                <th>Pembeli</th>
                <th>Produk</th>
                <th>Tanggal</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {recent.length === 0 ? (

                <tr>
                  <td
                    colSpan="4"
                    className="text-center text-muted py-4"
                  >
                    Belum ada transaksi.
                  </td>
                </tr>

              ) : (

                recent.map(
                  (item, index) => (
                    <tr key={item.id_pembelian || index}>

                      <td>
                        {item.nama_pembeli ||
                          item.nama ||
                          "-"}
                      </td>

                      <td>
                        {item.nama_produk ||
                          "-"}
                      </td>

                      <td>
                        {item.created_at
                          ? formatTanggal(
                              item.created_at
                            )
                          : "-"}
                      </td>

                      <td>
                        <span className="adm-badge">
                          {item.status ||
                            "Tertunda"}
                        </span>
                      </td>

                    </tr>
                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* QUICK ACTION */}
      <div className="adm-card">

        <div className="mb-4">
          <h6 className="fw-bold mb-1">
            Aksi Cepat
          </h6>

          <p className="text-muted small mb-0">
            Kelola toko Batik Singosaren
          </p>
        </div>

        <div className="row g-3">

          <div className="col-md-6 col-lg-3">
            <Link
              to="/admin/produk"
              className="adm-action-btn"
            >
              <i className="bi bi-plus-circle"></i>
              <span>Tambah Produk</span>
            </Link>
          </div>

          <div className="col-md-6 col-lg-3">
            <Link
              to="/admin/pesanan"
              className="adm-action-btn"
            >
              <i className="bi bi-box-seam"></i>
              <span>Kelola Pesanan</span>
            </Link>
          </div>

          <div className="col-md-6 col-lg-3">
            <Link
              to="/admin/pembeli"
              className="adm-action-btn"
            >
              <i className="bi bi-people"></i>
              <span>Data Pembeli</span>
            </Link>
          </div>

          <div className="col-md-6 col-lg-3">
            <Link
              to="/"
              className="adm-action-btn"
            >
              <i className="bi bi-shop"></i>
              <span>Lihat Toko</span>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}

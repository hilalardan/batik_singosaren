import { useEffect, useState } from "react";
import { apiRequest } from "../../api";
import { formatRupiah, formatTanggal } from "../../utils";

export default function AdminLaporan() {
  const [laporan, setLaporan] = useState([]);
  const [laporanTampil, setLaporanTampil] = useState([]);
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadLaporan();
  }, []);

  const loadLaporan = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiRequest("/api/admin/laporan-penjualan");

      if (!response.success) {
        throw new Error(response.message || "Gagal mengambil laporan penjualan");
      }

      const data = Array.isArray(response.data) ? response.data : [];

      const dataUrut = [...data].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setLaporan(dataUrut);
      setLaporanTampil(dataUrut);
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal mengambil laporan penjualan");
    } finally {
      setLoading(false);
    }
  };

  const filterLaporan = () => {
    let hasil = [...laporan];

    if (tanggalMulai) {
      const mulai = new Date(`${tanggalMulai}T00:00:00`);

      hasil = hasil.filter((item) => {
        if (!item.created_at) return false;
        return new Date(item.created_at) >= mulai;
      });
    }

    if (tanggalAkhir) {
      const akhir = new Date(`${tanggalAkhir}T23:59:59`);

      hasil = hasil.filter((item) => {
        if (!item.created_at) return false;
        return new Date(item.created_at) <= akhir;
      });
    }

    setLaporanTampil(hasil);
  };

  const resetFilter = () => {
    setTanggalMulai("");
    setTanggalAkhir("");
    setLaporanTampil(laporan);
  };

  const totalPenjualan = laporanTampil.reduce(
    (total, item) => total + Number(item.total || 0),
    0
  );

  const cetakLaporan = () => {
    if (laporanTampil.length === 0) {
      alert("Tidak ada data laporan yang dapat dicetak.");
      return;
    }

    const printWindow = window.open(
      "",
      "_blank",
      "width=1100,height=800"
    );

    if (!printWindow) {
      alert(
        "Popup diblokir browser. Silakan izinkan popup untuk mencetak laporan."
      );
      return;
    }

    const periode =
      tanggalMulai || tanggalAkhir
        ? `${tanggalMulai || "-"} s/d ${tanggalAkhir || "-"}`
        : "Semua Periode";

    const rows = laporanTampil
      .map(
        (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${formatTanggal(item.created_at)}</td>
            <td>${item.nama_pembeli || "-"}</td>
            <td>${item.nama_produk || "-"}</td>
            <td>${formatRupiah(item.harga || 0)}</td>
            <td>${item.jumlah || 0}</td>
            <td>${formatRupiah(item.total || 0)}</td>
            <td>${item.metode_pembayaran || "-"}</td>
            <td>${item.pengiriman || "-"}</td>
            <td>${item.status || "Tertunda"}</td>
          </tr>
        `
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">

        <title>
          Laporan Penjualan - Batik Singosaren
        </title>

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 30px;
            font-family: Arial, Helvetica, sans-serif;
            color: #111;
            background: #fff;
          }

          .laporan {
            width: 100%;
            max-width: 1200px;
            margin: auto;
          }

          .header {
            text-align: center;
            border-bottom: 2px solid #111;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }

          .header h1 {
            margin: 0 0 5px;
            font-size: 24px;
            text-transform: uppercase;
          }

          .header p {
            margin: 3px 0;
            font-size: 13px;
          }

          .judul {
            text-align: center;
            margin-bottom: 20px;
          }

          .judul h2 {
            margin: 0 0 6px;
            font-size: 20px;
          }

          .judul p {
            margin: 0;
            font-size: 13px;
          }

          .ringkasan {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            margin-bottom: 20px;
          }

          .box {
            flex: 1;
            border: 1px solid #ccc;
            padding: 12px 15px;
          }

          .box .label {
            font-size: 12px;
            color: #666;
            margin-bottom: 5px;
          }

          .box .value {
            font-size: 18px;
            font-weight: bold;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }

          th,
          td {
            border: 1px solid #bbb;
            padding: 8px;
            font-size: 11px;
          }

          th {
            background: #f2f2f2;
            font-weight: bold;
            text-align: center;
          }

          td {
            vertical-align: middle;
          }

          .text-center {
            text-align: center;
          }

          .text-right {
            text-align: right;
          }

          tfoot th {
            background: #f2f2f2;
            font-size: 12px;
          }

          .footer {
            margin-top: 30px;
            padding-top: 12px;
            border-top: 1px solid #ccc;
            text-align: right;
            font-size: 11px;
            color: #666;
          }

          @media print {
            @page {
              size: landscape;
              margin: 10mm;
            }

            body {
              padding: 0;
            }

            .laporan {
              max-width: none;
            }
          }
        </style>
      </head>

      <body>
        <div class="laporan">

          <div class="header">
            <h1>Batik Singosaren</h1>
            <p>Jl. Niken Gandini, Ponorogo, Jawa Timur</p>
          </div>

          <div class="judul">
            <h2>LAPORAN PENJUALAN</h2>
            <p>Periode: ${periode}</p>
          </div>

          <div class="ringkasan">

            <div class="box">
              <div class="label">
                Jumlah Transaksi
              </div>

              <div class="value">
                ${laporanTampil.length} Transaksi
              </div>
            </div>

            <div class="box">
              <div class="label">
                Total Penjualan
              </div>

              <div class="value">
                ${formatRupiah(totalPenjualan)}
              </div>
            </div>

          </div>

          <table>

            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Pembeli</th>
                <th>Produk</th>
                <th>Harga</th>
                <th>Jumlah</th>
                <th>Total</th>
                <th>Pembayaran</th>
                <th>Pengiriman</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              ${rows}
            </tbody>

            <tfoot>
              <tr>
                <th colspan="6" class="text-right">
                  TOTAL PENJUALAN
                </th>

                <th>
                  ${formatRupiah(totalPenjualan)}
                </th>

                <th colspan="3"></th>
              </tr>
            </tfoot>

          </table>

          <div class="footer">
            Dicetak dari sistem admin Batik Singosaren
          </div>

        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };

          window.onafterprint = function() {
            window.close();
          };
        </script>

      </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <div className="container-fluid py-4">

      <div className="mb-4">
        <h2 className="fw-normal mb-1">
          Laporan Penjualan
        </h2>

        <p className="text-muted mb-0">
          Lihat laporan penjualan Batik Singosaren berdasarkan tanggal.
        </p>
      </div>

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">

          <h5 className="fw-bold mb-4">
            Filter Laporan
          </h5>

          <div className="row g-3 align-items-end">

            <div className="col-md-4">
              <label className="form-label">
                Tanggal Mulai
              </label>

              <input
                type="date"
                className="form-control"
                value={tanggalMulai}
                onChange={(e) => setTanggalMulai(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">
                Tanggal Akhir
              </label>

              <input
                type="date"
                className="form-control"
                value={tanggalAkhir}
                onChange={(e) => setTanggalAkhir(e.target.value)}
              />
            </div>

            <div className="col-md-4">
              <div className="d-flex gap-2 flex-wrap">

                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={filterLaporan}
                >
                  <i className="bi bi-search me-2"></i>
                  Tampilkan Laporan
                </button>

                <button
                  type="button"
                  className="btn btn-outline-dark"
                  onClick={resetFilter}
                >
                  Reset
                </button>

                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={cetakLaporan}
                  disabled={laporanTampil.length === 0}
                >
                  <i className="bi bi-printer me-2"></i>
                  Cetak Laporan
                </button>

              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">

        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">

              <p className="text-muted mb-1">
                Jumlah Transaksi
              </p>

              <h3 className="fw-bold mb-1">
                {laporanTampil.length}
              </h3>

              <small className="text-muted">
                transaksi pada laporan
              </small>

            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">

              <p className="text-muted mb-1">
                Total Penjualan
              </p>

              <h3 className="fw-bold mb-1">
                {formatRupiah(totalPenjualan)}
              </h3>

              <small className="text-muted">
                total harga penjualan
              </small>

            </div>
          </div>
        </div>

      </div>

      <div className="card border-0 shadow-sm">

        <div className="card-body">

          <div className="d-flex justify-content-between align-items-center mb-3">

            <div>
              <h5 className="fw-bold mb-1">
                Laporan Penjualan
              </h5>

              <p className="text-muted mb-0">
                Semua data penjualan
              </p>
            </div>

            <span className="text-muted">
              {laporanTampil.length} Transaksi
            </span>

          </div>

          {loading && (
            <div className="text-center py-5">

              <div className="spinner-border"></div>

              <p className="mt-2 text-muted">
                Memuat laporan...
              </p>

            </div>
          )}

          {!loading && error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            laporanTampil.length === 0 && (
              <div className="text-center py-5 text-muted">

                <i className="bi bi-bar-chart fs-1"></i>

                <p className="mt-2 mb-0">
                  Belum ada data penjualan.
                </p>

              </div>
            )}

          {!loading &&
            !error &&
            laporanTampil.length > 0 && (
              <div className="table-responsive">

                <table className="table table-hover align-middle">

                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Tanggal</th>
                      <th>Pembeli</th>
                      <th>Produk</th>
                      <th>Harga</th>
                      <th>Jumlah</th>
                      <th>Total</th>
                      <th>Pembayaran</th>
                      <th>Pengiriman</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>

                    {laporanTampil.map((item, index) => (
                      <tr key={item.id || item.id_pembelian || index}>

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          {formatTanggal(item.created_at)}
                        </td>

                        <td>
                          {item.nama_pembeli || "-"}
                        </td>

                        <td>
                          {item.nama_produk || "-"}
                        </td>

                        <td>
                          {formatRupiah(item.harga || 0)}
                        </td>

                        <td>
                          {item.jumlah || 0}
                        </td>

                        <td className="fw-semibold">
                          {formatRupiah(item.total || 0)}
                        </td>

                        <td>
                          {item.metode_pembayaran || "-"}
                        </td>

                        <td>
                          {item.pengiriman || "-"}
                        </td>

                        <td>
                          <span className="badge bg-secondary">
                            {item.status || "Tertunda"}
                          </span>
                        </td>

                      </tr>
                    ))}

                  </tbody>

                  <tfoot>

                    <tr>

                      <th
                        colSpan="6"
                        className="text-end"
                      >
                        Total Penjualan
                      </th>

                      <th>
                        {formatRupiah(totalPenjualan)}
                      </th>

                      <th colSpan="3"></th>

                    </tr>

                  </tfoot>

                </table>

              </div>
            )}

        </div>
      </div>

    </div>
  );
}

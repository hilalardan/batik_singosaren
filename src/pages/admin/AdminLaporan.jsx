import { useEffect, useState } from "react";
import { adminApi } from "../../api";
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

      const response = await adminApi.getLaporanPenjualan();

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      const dataUrut = [...data].sort(
        (a, b) =>
          new Date(b.created_at) -
          new Date(a.created_at)
      );

      setLaporan(dataUrut);
      setLaporanTampil(dataUrut);
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          "Gagal mengambil laporan penjualan"
      );
    } finally {
      setLoading(false);
    }
  };

  const filterLaporan = () => {
    let hasil = [...laporan];

    if (tanggalMulai) {
      const mulai = new Date(
        `${tanggalMulai}T00:00:00`
      );

      hasil = hasil.filter((item) => {
        if (!item.created_at) return false;

        const tanggal = new Date(item.created_at);

        return tanggal >= mulai;
      });
    }

    if (tanggalAkhir) {
      const akhir = new Date(
        `${tanggalAkhir}T23:59:59`
      );

      hasil = hasil.filter((item) => {
        if (!item.created_at) return false;

        const tanggal = new Date(item.created_at);

        return tanggal <= akhir;
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
    (total, item) =>
      total + Number(item.total || 0),
    0
  );

  const totalProduk = laporanTampil.reduce(
    (total, item) =>
      total + Number(item.jumlah || 0),
    0
  );

  return (
    <div className="container-fluid py-4">

      {/* JUDUL */}
      <div className="mb-4">
        <h2 className="fw-normal mb-1">
          Laporan Penjualan
        </h2>

        <p className="text-muted mb-0">
          Lihat laporan penjualan Batik Singosaren berdasarkan tanggal.
        </p>
      </div>

      {/* FILTER LAPORAN */}
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
                onChange={(e) =>
                  setTanggalMulai(e.target.value)
                }
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
                onChange={(e) =>
                  setTanggalAkhir(e.target.value)
                }
              />
            </div>

            <div className="col-md-4">
              <div className="d-flex gap-2">

                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={filterLaporan}
                >
                  Tampilkan Laporan
                </button>

                <button
                  type="button"
                  className="btn btn-outline-dark"
                  onClick={resetFilter}
                >
                  Reset
                </button>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* RINGKASAN */}
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

      {/* DATA PENJUALAN */}
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

                    {laporanTampil.map(
                      (item, index) => (
                        <tr key={item.id}>

                          <td>
                            {index + 1}
                          </td>

                          <td>
                            {formatTanggal(
                              item.created_at
                            )}
                          </td>

                          <td>
                            {item.nama_pembeli ||
                              "-"}
                          </td>

                          <td>
                            {item.nama_produk ||
                              "-"}
                          </td>

                          <td>
                            {formatRupiah(
                              item.harga || 0
                            )}
                          </td>

                          <td>
                            {item.jumlah || 0}
                          </td>

                          <td className="fw-semibold">
                            {formatRupiah(
                              item.total || 0
                            )}
                          </td>

                          <td>
                            {item.metode_pembayaran ||
                              "-"}
                          </td>

                          <td>
                            {item.pengiriman ||
                              "-"}
                          </td>

                          <td>
                            <span className="badge bg-secondary">
                              {item.status ||
                                "Tertunda"}
                            </span>
                          </td>

                        </tr>
                      )
                    )}

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
                        {formatRupiah(
                          totalPenjualan
                        )}
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

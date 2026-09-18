import { useEffect, useState } from "react";
import { adminApi } from "../../api";
import { formatRupiah, formatTanggal } from "../../utils";

export default function AdminLaporan() {
  const [laporan, setLaporan] = useState([]);
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

      setLaporan(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal mengambil laporan penjualan");
    } finally {
      setLoading(false);
    }
  };

  const totalPenjualan = laporan.reduce(
    (total, item) =>
      total +
      Number(item.total || 0),
    0
  );

  const totalProduk = laporan.reduce(
    (total, item) =>
      total +
      Number(item.jumlah || 0),
    0
  );

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h2 className="fw-bold mb-1">
          Laporan Penjualan
        </h2>

        <p className="text-muted mb-0">
          Laporan transaksi penjualan Batik Singosaren.
        </p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">
                Total Transaksi
              </p>

              <h3 className="fw-bold mb-0">
                {laporan.length}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">
                Produk Terjual
              </p>

              <h3 className="fw-bold mb-0">
                {totalProduk}
              </h3>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="text-muted mb-1">
                Total Penjualan
              </p>

              <h3 className="fw-bold mb-0">
                {formatRupiah(totalPenjualan)}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">
              Data Penjualan
            </h5>

            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={loadLaporan}
            >
              <i className="bi bi-arrow-clockwise me-1"></i>
              Refresh
            </button>
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

          {!loading && !error && laporan.length === 0 && (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-bar-chart fs-1"></i>
              <p className="mt-2 mb-0">
                Belum ada data penjualan.
              </p>
            </div>
          )}

          {!loading && !error && laporan.length > 0 && (
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
                  {laporan.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>

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
                        {formatRupiah(item.harga)}
                      </td>

                      <td>
                        {item.jumlah}
                      </td>

                      <td className="fw-semibold">
                        {formatRupiah(item.total)}
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
                    <th colSpan="6" className="text-end">
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
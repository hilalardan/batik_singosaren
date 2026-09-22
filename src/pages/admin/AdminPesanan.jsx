import { useEffect, useState } from "react";
import { adminApi } from "../../api";
import { formatRupiah } from "../../utils";

export default function AdminPesanan() {
  const [pesanan, setPesanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPesanan, setSelectedPesanan] = useState(null);

  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  // =========================
  // AMBIL DATA PESANAN
  // =========================
  const loadPesanan = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await adminApi.getPembelian();

      console.log("DATA PESANAN:", res.data);

      if (!res.success) {
        setError(
          res.message || "Gagal mengambil data pesanan."
        );
        return;
      }

      setPesanan(
        Array.isArray(res.data)
          ? res.data
          : []
      );
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data pesanan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPesanan();
  }, []);

  // =========================
  // BUKA DETAIL
  // =========================
  const handleDetail = async (item) => {
    try {
      setSelectedPesanan(item);

      const id =
        item.id_pembelian ||
        item.id_pesanan ||
        item.id;

      if (!id) return;

      const res =
        await adminApi.getPembelianById(id);

      if (res.success && res.data) {
        setSelectedPesanan(res.data);

        setStatus(
          res.data.status ||
          res.data.status_pesanan ||
          ""
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // UPDATE STATUS
  // =========================
  const handleUpdateStatus = async () => {
    if (!selectedPesanan || !status) return;

    const id =
      selectedPesanan.id_pembelian ||
      selectedPesanan.id_pesanan ||
      selectedPesanan.id;

    if (!id) return;

    try {
      setSaving(true);

      const res =
        await adminApi.updatePembelian(
          id,
          {
            status: status,
          }
        );

      if (!res.success) {
        alert(
          res.message ||
          "Gagal mengubah status pesanan."
        );
        return;
      }

      alert("Status pesanan berhasil diubah.");

      setSelectedPesanan(null);

      await loadPesanan();
    } catch (err) {
      console.error(err);
      alert("Gagal mengubah status pesanan.");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // HAPUS PESANAN
  // =========================
  const handleDelete = async (item) => {
    const id =
      item.id_pembelian ||
      item.id_pesanan ||
      item.id;

    if (!id) {
      alert("ID pesanan tidak ditemukan.");
      return;
    }

    const yakin = window.confirm(
      "Yakin ingin menghapus pesanan ini?"
    );

    if (!yakin) return;

    try {
      const res =
        await adminApi.deletePembelian(id);

      if (!res.success) {
        alert(
          res.message ||
          "Gagal menghapus pesanan."
        );
        return;
      }

      alert("Pesanan berhasil dihapus.");

      await loadPesanan();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus pesanan.");
    }
  };

  // =========================
  // FORMAT DATA
  // =========================
  const getId = (item) =>
    item.id_pembelian ||
    item.id_pesanan ||
    item.id ||
    "-";

  const getNama = (item) =>
    item.nama_pembeli ||
    item.nama ||
    item.username ||
    item.uname ||
    item.nama_user ||
    "-";

  const getTanggal = (item) =>
    item.created_at ||
    item.tanggal_pembelian ||
    item.tanggal ||
    item.createdAt ||
    "-";

  const getStatus = (item) =>
    item.status ||
    item.status_pesanan ||
    "Menunggu";

  const getTotal = (item) =>
    item.total ||
    item.total_harga ||
    item.grand_total ||
    item.jumlah_total ||
    0;

  const getStatusClass = (value) => {
    const statusLower =
      String(value).toLowerCase();

    if (
      statusLower.includes("selesai") ||
      statusLower.includes("diterima")
    ) {
      return "success";
    }

    if (
      statusLower.includes("proses") ||
      statusLower.includes("dikirim")
    ) {
      return "primary";
    }

    if (
      statusLower.includes("batal") ||
      statusLower.includes("tolak")
    ) {
      return "danger";
    }

    return "warning";
  };

  return (
    <div className="container-fluid">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2 className="fw-bold mb-1">
            Kelola Pesanan
          </h2>

          <p className="text-muted mb-0">
            Kelola pesanan pembeli Batik Singosaren.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={loadPesanan}
        >
          <i className="bi bi-arrow-clockwise me-1"></i>
          Refresh
        </button>

      </div>

      {/* ERROR */}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="text-center py-5">
          <div
            className="spinner-border"
            role="status"
          ></div>

          <p className="mt-3 text-muted">
            Memuat data pesanan...
          </p>
        </div>
      ) : (
        <div className="card border-0 shadow-sm">

          <div className="card-body">

            <div className="table-responsive">

              <table className="table align-middle">

                <thead>
                  <tr>
                    <th>No</th>
                    <th>ID Pesanan</th>
                    <th>Pembeli</th>
                    <th>Tanggal</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>

                  {pesanan.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-5 text-muted"
                      >
                        Belum ada pesanan.
                      </td>
                    </tr>
                  ) : (
                    pesanan.map(
                      (item, index) => {
                        const statusValue =
                          getStatus(item);

                        return (
                          <tr key={getId(item)}>

                            <td>
                              {index + 1}
                            </td>

                            <td>
                              <strong>
                                #{getId(item)}
                              </strong>
                            </td>

                            <td>
                              {getNama(item)}
                            </td>

                            <td>
                              {getTanggal(item)}
                            </td>

                            <td>
                              {formatRupiah(
                                Number(
                                  getTotal(item)
                                )
                              )}
                            </td>

                            <td>
                              <span
                                className={`badge text-bg-${getStatusClass(
                                  statusValue
                                )}`}
                              >
                                {statusValue}
                              </span>
                            </td>

                            <td>

                              <div className="d-flex gap-2">

                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() =>
                                    handleDetail(item)
                                  }
                                >
                                  <i className="bi bi-eye"></i>
                                </button>

                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() =>
                                    handleDelete(item)
                                  }
                                >
                                  <i className="bi bi-trash"></i>
                                </button>

                              </div>

                            </td>

                          </tr>
                        );
                      }
                    )
                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>
      )}

      {/* MODAL DETAIL */}
      {selectedPesanan && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{
            backgroundColor:
              "rgba(0,0,0,0.5)",
          }}
        >

          <div className="modal-dialog modal-lg modal-dialog-centered">

            <div className="modal-content">

              <div className="modal-header">

                <h5 className="modal-title">
                  Detail Pesanan #
                  {getId(selectedPesanan)}
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

                <div className="row g-3">

                  <div className="col-md-6">
                    <div className="small text-muted">
                      Pembeli
                    </div>

                    <strong>
                      {getNama(selectedPesanan)}
                    </strong>
                  </div>

                  <div className="col-md-6">
                    <div className="small text-muted">
                      Total
                    </div>

                    <strong>
                      {formatRupiah(
                        Number(
                          getTotal(
                            selectedPesanan
                          )
                        )
                      )}
                    </strong>
                  </div>

                  <div className="col-12">
                    <div className="small text-muted">
                      Alamat
                    </div>

                    <div>
                      {selectedPesanan.alamat ||
                        selectedPesanan.alamat_pengiriman ||
                        "-"}
                    </div>
                  </div>

                  <div className="col-md-6">

                    <label className="form-label">
                      Status Pesanan
                    </label>

                    <select
                      className="form-select"
                      value={status}
                      onChange={(e) =>
                        setStatus(e.target.value)
                      }
                    >
                      <option value="">
                        Pilih status
                      </option>

                      <option value="Menunggu">
                        Menunggu
                      </option>

                      <option value="Diproses">
                        Diproses
                      </option>

                      <option value="Dikirim">
                        Dikirim
                      </option>

                      <option value="Selesai">
                        Selesai
                      </option>

                      <option value="Dibatalkan">
                        Dibatalkan
                      </option>
                    </select>

                  </div>

                  {/* DETAIL PRODUK */}
                  <div className="col-12">

                    <div className="small text-muted mb-2">
                      Detail Produk
                    </div>

                    {Array.isArray(
                      selectedPesanan.detail
                    ) &&
                    selectedPesanan.detail.length > 0 ? (
                      <div className="table-responsive">

                        <table className="table table-sm">

                          <thead>
                            <tr>
                              <th>Produk</th>
                              <th>Harga</th>
                              <th>Jumlah</th>
                              <th>Subtotal</th>
                            </tr>
                          </thead>

                          <tbody>

                            {selectedPesanan.detail.map(
                              (produk, index) => {

                                const harga =
                                  Number(
                                    produk.harga ||
                                    produk.harga_produk ||
                                    0
                                  );

                                const jumlah =
                                  Number(
                                    produk.jumlah ||
                                    produk.qty ||
                                    produk.quantity ||
                                    0
                                  );

                                const subtotal =
                                  Number(
                                    produk.subtotal ||
                                    harga * jumlah
                                  );

                                return (
                                  <tr
                                    key={
                                      produk.id_detail ||
                                      index
                                    }
                                  >

                                    <td>
                                      {produk.nama_produk ||
                                        produk.nama ||
                                        "-"}
                                    </td>

                                    <td>
                                      {formatRupiah(
                                        harga
                                      )}
                                    </td>

                                    <td>
                                      {jumlah}
                                    </td>

                                    <td>
                                      {formatRupiah(
                                        subtotal
                                      )}
                                    </td>

                                  </tr>
                                );
                              }
                            )}

                          </tbody>

                        </table>

                      </div>
                    ) : (
                      <div className="text-muted">
                        Detail produk tidak tersedia.
                      </div>
                    )}

                  </div>

                </div>

              </div>

              <div className="modal-footer">

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() =>
                    setSelectedPesanan(null)
                  }
                >
                  Tutup
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdateStatus}
                  disabled={
                    saving || !status
                  }
                >
                  {saving ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                      ></span>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-lg me-1"></i>
                      Simpan Status
                    </>
                  )}
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

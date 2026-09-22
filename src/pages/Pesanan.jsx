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

  const loadPesanan = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await adminApi.getPembelian();

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
    item.nama_d ||
    item.nama_b ||
    "-";

  const getTanggal = (item) => {
    const tanggal =
      item.created_at ||
      item.tanggal_pembelian ||
      item.tanggal ||
      item.createdAt;

    if (!tanggal) return "-";

    const hasil = new Date(tanggal);

    if (isNaN(hasil.getTime())) {
      return "-";
    }

    return hasil.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getProduk = (item) =>
    item.nama_produk ||
    item.nama ||
    item.nama_barang ||
    "-";

  const getHarga = (item) =>
    Number(
      item.harga ||
      item.harga_produk ||
      item.price ||
      0
    );

  const getJumlah = (item) =>
    Number(item.jumlah || item.qty || 1);

  const getStatus = (item) =>
    item.status ||
    item.status_pesanan ||
    "Menunggu";

  const getTotal = (item) => {
    if (
      item.total !== undefined &&
      item.total !== null
    ) {
      return Number(item.total);
    }

    if (
      item.total_harga !== undefined &&
      item.total_harga !== null
    ) {
      return Number(item.total_harga);
    }

    if (
      item.grand_total !== undefined &&
      item.grand_total !== null
    ) {
      return Number(item.grand_total);
    }

    if (
      item.jumlah_total !== undefined &&
      item.jumlah_total !== null
    ) {
      return Number(item.jumlah_total);
    }

    return getHarga(item) * getJumlah(item);
  };

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
      statusLower.includes("dikirim") ||
      statusLower.includes("dikemas")
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
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            Pesanan
          </h2>
          <p className="text-muted mb-0">
            Kelola pesanan pelanggan Batik Singosaren.
          </p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={loadPesanan}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border text-primary"
                role="status"
              ></div>

              <p className="mt-3 text-muted">
                Memuat data pesanan...
              </p>
            </div>
          ) : pesanan.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-bag-x fs-1 text-muted"></i>

              <p className="mt-3 text-muted">
                Belum ada pesanan.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Pembeli</th>
                    <th>Tanggal</th>
                    <th>Produk</th>
                    <th>Harga</th>
                    <th>Jumlah</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th className="text-center">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {pesanan.map((item, index) => {
                    const statusPesanan =
                      getStatus(item);

                    return (
                      <tr key={getId(item)}>
                        <td>
                          {index + 1}
                        </td>

                        <td>
                          <div className="fw-semibold">
                            {getNama(item)}
                          </div>

                          {item.email && (
                            <small className="text-muted">
                              {item.email}
                            </small>
                          )}
                        </td>

                        <td>
                          {getTanggal(item)}
                        </td>

                        <td>
                          {getProduk(item)}
                        </td>

                        <td>
                          {formatRupiah(
                            getHarga(item)
                          )}
                        </td>

                        <td>
                          {getJumlah(item)}
                        </td>

                        <td className="fw-semibold">
                          {formatRupiah(
                            getTotal(item)
                          )}
                        </td>

                        <td>
                          <span
                            className={`badge text-bg-${getStatusClass(
                              statusPesanan
                            )}`}
                          >
                            {statusPesanan}
                          </span>
                        </td>

                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() =>
                                handleDetail(item)
                              }
                              title="Detail"
                            >
                              <i className="bi bi-eye"></i>
                            </button>

                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() =>
                                handleDelete(item)
                              }
                              title="Hapus"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedPesanan && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{
            backgroundColor:
              "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Detail Pesanan
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
                    <small className="text-muted">
                      ID Pesanan
                    </small>

                    <div className="fw-semibold">
                      #{getId(selectedPesanan)}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted">
                      Pembeli
                    </small>

                    <div className="fw-semibold">
                      {getNama(selectedPesanan)}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted">
                      Tanggal
                    </small>

                    <div className="fw-semibold">
                      {getTanggal(
                        selectedPesanan
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted">
                      Produk
                    </small>

                    <div className="fw-semibold">
                      {getProduk(
                        selectedPesanan
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted">
                      Harga
                    </small>

                    <div className="fw-semibold">
                      {formatRupiah(
                        getHarga(
                          selectedPesanan
                        )
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted">
                      Jumlah
                    </small>

                    <div className="fw-semibold">
                      {getJumlah(
                        selectedPesanan
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted">
                      Total
                    </small>

                    <div className="fw-bold text-primary">
                      {formatRupiah(
                        getTotal(
                          selectedPesanan
                        )
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted">
                      Pembayaran
                    </small>

                    <div className="fw-semibold">
                      {selectedPesanan.metode_pembayaran ||
                        "-"}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted">
                      Pengiriman
                    </small>

                    <div className="fw-semibold">
                      {selectedPesanan.pengiriman ||
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
                        setStatus(
                          e.target.value
                        )
                      }
                    >
                      <option value="">
                        Pilih status
                      </option>

                      <option value="Tertunda">
                        Tertunda
                      </option>

                      <option value="Dikemas">
                        Dikemas
                      </option>

                      <option value="Dikirim">
                        Dikirim
                      </option>

                      <option value="Diterima">
                        Diterima
                      </option>

                      <option value="Selesai">
                        Selesai
                      </option>

                      <option value="Dibatalkan">
                        Dibatalkan
                      </option>
                    </select>
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
                  disabled={saving || !status}
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
                      <i className="bi bi-check-lg me-2"></i>
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

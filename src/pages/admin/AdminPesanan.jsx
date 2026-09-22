
import { useEffect, useState } from "react";
import { adminApi } from "../../api";
import { formatRupiah } from "../../utils";

export default function AdminPesanan() {
  const [pesanan, setPesanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPesanan, setSelectedPesanan] = useState(null);
  const [statusBaru, setStatusBaru] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPesanan();
  }, []);

  const loadPesanan = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminApi.getPembelian();

      const data = Array.isArray(response?.data)
        ? response.data
        : [];

      setPesanan(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal mengambil data pesanan");
    } finally {
      setLoading(false);
    }
  };

  const getTanggal = (item) => {
    const tanggal =
      item.created_at ||
      item.tanggal_pembelian ||
      item.tanggal ||
      item.createdAt;

    if (!tanggal) return "-";

    const tanggalString = String(tanggal);

    const bagianTanggal =
      tanggalString.split("T")[0];

    const bagian =
      bagianTanggal.split("-");

    if (bagian.length === 3) {
      return `${bagian[2]}/${bagian[1]}/${bagian[0]}`;
    }

    return tanggalString;
  };

  const getId = (item) => {
    return item.id || item.id_pembelian;
  };

  const getNama = (item) => {
    return (
      item.nama_pembeli ||
      item.nama_d ||
      item.nama_b ||
      item.nama ||
      "-"
    );
  };

  const getProduk = (item) => {
    return (
      item.nama_produk ||
      item.nama_product ||
      item.produk ||
      "-"
    );
  };

  const getHarga = (item) => {
    return Number(
      item.harga ||
      item.harga_produk ||
      0
    );
  };

  const getJumlah = (item) => {
    return Number(item.jumlah || 0);
  };

  const getTotal = (item) => {
    if (item.total !== undefined && item.total !== null) {
      return Number(item.total);
    }

    return getHarga(item) * getJumlah(item);
  };

  const getStatus = (item) => {
    return item.status || "Tertunda";
  };

  const getStatusClass = (status) => {
    switch (String(status).toLowerCase()) {
      case "selesai":
        return "bg-success";

      case "diterima":
        return "bg-primary";

      case "dikirim":
        return "bg-info text-dark";

      case "dikemas":
        return "bg-warning text-dark";

      case "dibatalkan":
        return "bg-danger";

      case "tertunda":
      default:
        return "bg-secondary";
    }
  };

  const bukaDetail = (item) => {
    setSelectedPesanan(item);
    setStatusBaru(getStatus(item));
  };

  const tutupDetail = () => {
    if (saving) return;

    setSelectedPesanan(null);
    setStatusBaru("");
  };

  const handleUpdateStatus = async () => {
    if (!selectedPesanan) return;

    try {
      setSaving(true);

      const id = getId(selectedPesanan);

      await adminApi.updatePembelian(id, {
        status: statusBaru,
      });

      await loadPesanan();

      setSelectedPesanan(null);
      setStatusBaru("");
    } catch (err) {
      console.error(err);
      alert(
        err.message || "Gagal mengubah status pesanan"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    const id = getId(item);

    if (!id) {
      alert("ID pesanan tidak ditemukan");
      return;
    }

    const yakin = window.confirm(
      "Yakin ingin menghapus pesanan ini?"
    );

    if (!yakin) return;

    try {
      await adminApi.deletePembelian(id);

      if (
        selectedPesanan &&
        getId(selectedPesanan) === id
      ) {
        setSelectedPesanan(null);
      }

      await loadPesanan();
    } catch (err) {
      console.error(err);
      alert(
        err.message || "Gagal menghapus pesanan"
      );
    }
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
          type="button"
          className="btn btn-outline-secondary"
          onClick={loadPesanan}
          disabled={loading}
        >
          {loading ? "Memuat..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div
          className="alert alert-danger"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div
                className="spinner-border"
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>

              <p className="mt-3 mb-0 text-muted">
                Memuat data pesanan...
              </p>
            </div>
          ) : pesanan.length === 0 ? (
            <div className="text-center py-5">
              <h5 className="mb-2">
                Belum ada pesanan
              </h5>

              <p className="text-muted mb-0">
                Data pesanan akan muncul di sini.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
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
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {pesanan.map((item, index) => (
                    <tr key={getId(item) || index}>
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
                          className={`badge ${getStatusClass(
                            getStatus(item)
                          )}`}
                        >
                          {getStatus(item)}
                        </span>
                      </td>

                      <td>
                        <div className="d-flex gap-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              bukaDetail(item)
                            }
                          >
                            Detail
                          </button>

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              handleDelete(item)
                            }
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {selectedPesanan && (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          style={{
            backgroundColor:
              "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Detail Pesanan
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={tutupDetail}
                  disabled={saving}
                />
              </div>

              <div className="modal-body">
                <div className="row g-3">
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

                    <div className="fw-semibold">
                      {formatRupiah(
                        getTotal(
                          selectedPesanan
                        )
                      )}
                    </div>
                  </div>

                  {selectedPesanan.metode_pembayaran && (
                    <div className="col-md-6">
                      <small className="text-muted">
                        Metode Pembayaran
                      </small>

                      <div className="fw-semibold">
                        {
                          selectedPesanan.metode_pembayaran
                        }
                      </div>
                    </div>
                  )}

                  {selectedPesanan.pengiriman && (
                    <div className="col-md-6">
                      <small className="text-muted">
                        Pengiriman
                      </small>

                      <div className="fw-semibold">
                        {
                          selectedPesanan.pengiriman
                        }
                      </div>
                    </div>
                  )}

                  {selectedPesanan.alamat_pembeli && (
                    <div className="col-12">
                      <small className="text-muted">
                        Alamat
                      </small>

                      <div className="fw-semibold">
                        {
                          selectedPesanan.alamat_pembeli
                        }
                      </div>
                    </div>
                  )}

                  {selectedPesanan.phone_pembeli && (
                    <div className="col-md-6">
                      <small className="text-muted">
                        No. Telepon
                      </small>

                      <div className="fw-semibold">
                        {
                          selectedPesanan.phone_pembeli
                        }
                      </div>
                    </div>
                  )}

                  {selectedPesanan.catatan && (
                    <div className="col-12">
                      <small className="text-muted">
                        Catatan
                      </small>

                      <div className="fw-semibold">
                        {selectedPesanan.catatan}
                      </div>
                    </div>
                  )}

                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      Status Pesanan
                    </label>

                    <select
                      className="form-select"
                      value={statusBaru}
                      onChange={(e) =>
                        setStatusBaru(
                          e.target.value
                        )
                      }
                      disabled={saving}
                    >
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
                  onClick={tutupDetail}
                  disabled={saving}
                >
                  Tutup
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdateStatus}
                  disabled={saving}
                >
                  {saving
                    ? "Menyimpan..."
                    : "Simpan Status"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

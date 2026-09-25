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

  async function loadPesanan() {
    try {
      setLoading(true);
      setError("");

      const response = await adminApi.getPembelian();

      if (response?.success) {
        setPesanan(Array.isArray(response.data) ? response.data : []);
      } else {
        setPesanan([]);
        setError(response?.message || "Gagal mengambil data pesanan.");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal mengambil data pesanan.");
    } finally {
      setLoading(false);
    }
  }

  function getTanggal(item) {
    if (!item?.created_at) return "-";

    return new Date(item.created_at).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function getId(item) {
    return item?.id_pembelian || item?.id || "-";
  }

  function getNama(item) {
    return item?.nama_pembeli || item?.nama || "-";
  }

  function getProduk(item) {
    return item?.nama_produk || item?.produk?.nama_produk || "-";
  }

  function getHarga(item) {
    return Number(item?.harga || item?.harga_produk || 0);
  }

  function getJumlah(item) {
    return Number(item?.jumlah || 0);
  }

  function getTotal(item) {
    if (item?.total !== undefined && item?.total !== null) {
      return Number(item.total);
    }

    return getHarga(item) * getJumlah(item);
  }

  function getStatus(item) {
    return item?.status || "Tertunda";
  }

  function getStatusClass(status) {
    switch (status) {
      case "Selesai":
        return "bg-success";

      case "Diterima":
        return "bg-primary";

      case "Dikirim":
        return "bg-info text-dark";

      case "Dikemas":
        return "bg-warning text-dark";

      case "Dibatalkan":
        return "bg-danger";

      default:
        return "bg-secondary";
    }
  }

  function bukaDetail(item) {
    setSelectedPesanan(item);
    setStatusBaru(getStatus(item));
  }

  function tutupDetail() {
    if (saving) return;

    setSelectedPesanan(null);
    setStatusBaru("");
  }

  async function handleUpdateStatus() {
    if (!selectedPesanan) return;

    try {
      setSaving(true);

      const id = getId(selectedPesanan);

      await adminApi.updatePembelian(id, {
        status: statusBaru,
      });

      alert("Status pesanan berhasil diperbarui.");

      setSelectedPesanan(null);
      setStatusBaru("");

      await loadPesanan();
    } catch (err) {
      console.error(err);
      alert(err.message || "Gagal memperbarui status pesanan.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    const id = getId(item);

    const yakin = window.confirm(
      `Yakin ingin menghapus pesanan #${id}?`
    );

    if (!yakin) return;

    try {
      await adminApi.deletePembelian(id);

      alert("Pesanan berhasil dihapus.");

      await loadPesanan();

      if (selectedPesanan && getId(selectedPesanan) === id) {
        setSelectedPesanan(null);
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Gagal menghapus pesanan.");
    }
  }

  function cetakStruk() {
    if (!selectedPesanan) return;

    const item = selectedPesanan;

    const id = getId(item);
    const tanggal = getTanggal(item);
    const nama = getNama(item);
    const produk = getProduk(item);
    const harga = getHarga(item);
    const jumlah = getJumlah(item);
    const total = getTotal(item);
    const status = getStatus(item);

    const phone = item?.phone_pembeli || item?.phone || "-";
    const alamat = item?.alamat_pembeli || item?.alamat || "-";
    const metodePembayaran =
      item?.metode_pembayaran || item?.pembayaran || "-";
    const pengiriman = item?.pengiriman || "-";
    const catatan = item?.catatan || "-";

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Popup diblokir browser. Silakan izinkan popup untuk mencetak struk.");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>Struk Pesanan #${id}</title>

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            font-family: Arial, Helvetica, sans-serif;
            margin: 0;
            padding: 30px;
            color: #222;
            background: #fff;
          }

          .struk {
            width: 100%;
            max-width: 700px;
            margin: auto;
          }

          .header {
            text-align: center;
            border-bottom: 2px solid #222;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }

          .header h1 {
            margin: 0 0 5px;
            font-size: 26px;
          }

          .header p {
            margin: 3px 0;
            font-size: 13px;
          }

          .judul {
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
          }

          .info {
            margin-bottom: 20px;
          }

          .info-row {
            display: flex;
            margin-bottom: 7px;
          }

          .label {
            width: 150px;
            font-weight: bold;
          }

          .value {
            flex: 1;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            margin-bottom: 20px;
          }

          th,
          td {
            border: 1px solid #ccc;
            padding: 10px;
            font-size: 13px;
          }

          th {
            background: #f2f2f2;
            text-align: left;
          }

          .text-right {
            text-align: right;
          }

          .total {
            font-size: 17px;
            font-weight: bold;
            text-align: right;
            margin-top: 10px;
          }

          .footer {
            border-top: 1px solid #ccc;
            margin-top: 30px;
            padding-top: 15px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }

          @media print {
            body {
              padding: 0;
            }

            .struk {
              max-width: none;
            }
          }
        </style>
      </head>

      <body>
        <div class="struk">

          <div class="header">
            <h1>Batik Singosaren</h1>
            <p>Jl. Niken Gandini, Ponorogo, Jawa Timur</p>
            <p>info@batiksingosaren.com</p>
          </div>

          <div class="judul">
            STRUK PESANAN
          </div>

          <div class="info">
            <div class="info-row">
              <div class="label">No. Pesanan</div>
              <div class="value">#${id}</div>
            </div>

            <div class="info-row">
              <div class="label">Tanggal</div>
              <div class="value">${tanggal}</div>
            </div>

            <div class="info-row">
              <div class="label">Nama Pembeli</div>
              <div class="value">${nama}</div>
            </div>

            <div class="info-row">
              <div class="label">No. Telepon</div>
              <div class="value">${phone}</div>
            </div>

            <div class="info-row">
              <div class="label">Alamat</div>
              <div class="value">${alamat}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Produk</th>
                <th>Harga</th>
                <th>Jumlah</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>${produk}</td>
                <td>${formatRupiah(harga)}</td>
                <td>${jumlah}</td>
                <td>${formatRupiah(total)}</td>
              </tr>
            </tbody>
          </table>

          <div class="info">
            <div class="info-row">
              <div class="label">Pembayaran</div>
              <div class="value">${metodePembayaran}</div>
            </div>

            <div class="info-row">
              <div class="label">Pengiriman</div>
              <div class="value">${pengiriman}</div>
            </div>

            <div class="info-row">
              <div class="label">Status</div>
              <div class="value">${status}</div>
            </div>

            <div class="info-row">
              <div class="label">Catatan</div>
              <div class="value">${catatan}</div>
            </div>
          </div>

          <div class="total">
            Total Pembayaran: ${formatRupiah(total)}
          </div>

          <div class="footer">
            <p>Terima kasih telah berbelanja di Batik Singosaren.</p>
            <p>Struk ini dicetak dari sistem admin Batik Singosaren.</p>
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
  }

  return (
    <div className="container-fluid py-4">

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">
            Pesanan
          </h3>

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
              <i className="bi bi-cart-x fs-1 text-muted"></i>

              <h5 className="mt-3">
                Belum ada pesanan
              </h5>

              <p className="text-muted">
                Data pesanan pelanggan akan muncul di sini.
              </p>
            </div>
          ) : (
            <div className="table-responsive">

              <table className="table table-hover align-middle">

                <thead className="table-light">
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

                  {pesanan.map((item, index) => {
                    const status = getStatus(item);

                    return (
                      <tr key={getId(item)}>

                        <td>
                          {index + 1}
                        </td>

                        <td>
                          <strong>
                            {getNama(item)}
                          </strong>
                        </td>

                        <td>
                          {getTanggal(item)}
                        </td>

                        <td>
                          {getProduk(item)}
                        </td>

                        <td>
                          {formatRupiah(getHarga(item))}
                        </td>

                        <td>
                          {getJumlah(item)}
                        </td>

                        <td>
                          <strong>
                            {formatRupiah(getTotal(item))}
                          </strong>
                        </td>

                        <td>
                          <span
                            className={`badge ${getStatusClass(status)}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td>
                          <div className="d-flex gap-2">

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => bukaDetail(item)}
                            >
                              <i className="bi bi-eye me-1"></i>
                              Detail
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(item)}
                            >
                              <i className="bi bi-trash me-1"></i>
                              Hapus
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
          style={{ backgroundColor: "rgba(0,0,0,.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">

            <div className="modal-content">

              <div className="modal-header">

                <h5 className="modal-title fw-bold">
                  Detail Pesanan #{getId(selectedPesanan)}
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={tutupDetail}
                  disabled={saving}
                ></button>

              </div>

              <div className="modal-body">

                <div className="row g-3">

                  <div className="col-md-6">

                    <h6 className="fw-bold mb-3">
                      Data Pembeli
                    </h6>

                    <div className="mb-2">
                      <strong>Nama:</strong>{" "}
                      {getNama(selectedPesanan)}
                    </div>

                    <div className="mb-2">
                      <strong>Telepon:</strong>{" "}
                      {selectedPesanan.phone_pembeli ||
                        selectedPesanan.phone ||
                        "-"}
                    </div>

                    <div className="mb-2">
                      <strong>Alamat:</strong>{" "}
                      {selectedPesanan.alamat_pembeli ||
                        selectedPesanan.alamat ||
                        "-"}
                    </div>

                  </div>

                  <div className="col-md-6">

                    <h6 className="fw-bold mb-3">
                      Informasi Pesanan
                    </h6>

                    <div className="mb-2">
                      <strong>Tanggal:</strong>{" "}
                      {getTanggal(selectedPesanan)}
                    </div>

                    <div className="mb-2">
                      <strong>Produk:</strong>{" "}
                      {getProduk(selectedPesanan)}
                    </div>

                    <div className="mb-2">
                      <strong>Harga:</strong>{" "}
                      {formatRupiah(
                        getHarga(selectedPesanan)
                      )}
                    </div>

                    <div className="mb-2">
                      <strong>Jumlah:</strong>{" "}
                      {getJumlah(selectedPesanan)}
                    </div>

                    <div className="mb-2">
                      <strong>Total:</strong>{" "}
                      {formatRupiah(
                        getTotal(selectedPesanan)
                      )}
                    </div>

                  </div>

                  <div className="col-md-6">

                    <h6 className="fw-bold mb-3">
                      Pembayaran & Pengiriman
                    </h6>

                    <div className="mb-2">
                      <strong>Pembayaran:</strong>{" "}
                      {selectedPesanan.metode_pembayaran ||
                        selectedPesanan.pembayaran ||
                        "-"}
                    </div>

                    <div className="mb-2">
                      <strong>Pengiriman:</strong>{" "}
                      {selectedPesanan.pengiriman || "-"}
                    </div>

                  </div>

                  <div className="col-md-6">

                    <h6 className="fw-bold mb-3">
                      Catatan
                    </h6>

                    <div className="border rounded p-3 bg-light">
                      {selectedPesanan.catatan || "-"}
                    </div>

                  </div>

                  <div className="col-12">

                    <label className="form-label fw-bold">
                      Status Pesanan
                    </label>

                    <select
                      className="form-select"
                      value={statusBaru}
                      onChange={(e) =>
                        setStatusBaru(e.target.value)
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
                  className="btn btn-outline-dark"
                  onClick={cetakStruk}
                  disabled={saving}
                >
                  <i className="bi bi-printer me-2"></i>
                  Cetak Struk
                </button>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleUpdateStatus}
                  disabled={saving}
                >
                  {saving ? (
                    "Menyimpan..."
                  ) : (
                    <>
                      <i className="bi bi-save me-2"></i>
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

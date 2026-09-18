import { useEffect, useState } from "react";
import { adminApi } from "../../api";
import { formatRupiah, formatTanggal } from "../../utils";
import {
  METODE_BAYAR,
  STATUS_PROSES,
  STATUS_BAYAR,
} from "../../constants";

export default function Pembelian() {
  const [daftar, setDaftar] = useState([]);
  const [daftarTampil, setDaftarTampil] = useState([]);

  const [pesan, setPesan] = useState("");
  const [detail, setDetail] = useState(null);

  const [showDetail, setShowDetail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter tanggal
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");

  const [form, setForm] = useState({
    metode_bayar: "",
    pembayaran: "",
    status: "",
  });

  // ==============================
  // AMBIL DATA PEMBELIAN
  // ==============================
  const muatPembelian = async () => {
    try {
      const data = await adminApi.getPembelian();

      if (data.success) {
        const hasil = data.data || [];

        setDaftar(hasil);
        setDaftarTampil(hasil);
      } else {
        setPesan(
          data.message || "Gagal mengambil data pembelian"
        );
      }
    } catch (err) {
      setPesan(
        err.message || "Gagal mengambil data pembelian"
      );
    }
  };

  useEffect(() => {
    muatPembelian();
  }, []);

  // ==============================
  // FILTER LAPORAN BERDASARKAN TANGGAL
  // ==============================
  const tampilkanLaporan = () => {
    setPesan("");

    if (!tanggalMulai && !tanggalAkhir) {
      setDaftarTampil(daftar);
      return;
    }

    if (tanggalMulai && tanggalAkhir && tanggalMulai > tanggalAkhir) {
      setPesan(
        "Tanggal mulai tidak boleh lebih besar dari tanggal akhir."
      );
      return;
    }

    const hasil = daftar.filter((item) => {
      if (!item.created_at) return false;

      const tanggal = new Date(item.created_at);

      const tahun = tanggal.getFullYear();
      const bulan = String(tanggal.getMonth() + 1).padStart(2, "0");
      const hari = String(tanggal.getDate()).padStart(2, "0");

      const tanggalData = `${tahun}-${bulan}-${hari}`;

      if (tanggalMulai && tanggalData < tanggalMulai) {
        return false;
      }

      if (tanggalAkhir && tanggalData > tanggalAkhir) {
        return false;
      }

      return true;
    });

    setDaftarTampil(hasil);
  };

  // ==============================
  // RESET FILTER
  // ==============================
  const resetLaporan = () => {
    setTanggalMulai("");
    setTanggalAkhir("");
    setDaftarTampil(daftar);
    setPesan("");
  };

  // ==============================
  // DETAIL PEMBELIAN
  // ==============================
  const lihatDetail = async (item) => {
    try {
      setPesan("");

      const data = await adminApi.getPembelianById(item.id);

      if (data.success) {
        setDetail(data.data);
        setShowDetail(true);
      } else {
        setPesan(
          data.message || "Gagal mengambil detail pembelian"
        );
      }
    } catch (err) {
      setPesan(
        err.message || "Gagal mengambil detail pembelian"
      );
    }
  };

  // ==============================
  // MULAI EDIT
  // ==============================
  const mulaiEdit = (item) => {
    setDetail(item);

    setForm({
      metode_bayar:
        item.metode_pembayaran ||
        METODE_BAYAR[0] ||
        "",

      pembayaran:
        item.pembayaran ||
        STATUS_BAYAR[0] ||
        "",

      status:
        item.status ||
        STATUS_PROSES[0] ||
        "",
    });

    setShowDetail(false);
    setShowEdit(true);
    setPesan("");
  };

  // ==============================
  // HANDLE FORM
  // ==============================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ==============================
  // SIMPAN EDIT
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!detail) return;

    setLoading(true);
    setPesan("");

    try {
      const data = await adminApi.updatePembelian(
        detail.id,
        {
          metode_pembayaran: form.metode_bayar,
          pembayaran: form.pembayaran,
          status: form.status,
        }
      );

      if (data.success) {
        setShowEdit(false);
        setDetail(null);

        await muatPembelian();

        // Terapkan kembali filter setelah update
        setTimeout(() => {
          tampilkanLaporan();
        }, 0);
      } else {
        setPesan(
          data.message || "Gagal menyimpan perubahan"
        );
      }
    } catch (err) {
      setPesan(
        err.message || "Gagal menyimpan perubahan"
      );
    }

    setLoading(false);
  };

  // ==============================
  // HAPUS
  // ==============================
  const handleDelete = async (id) => {
    if (!confirm("Yakin mau hapus pembelian ini?")) {
      return;
    }

    try {
      setPesan("");

      const data = await adminApi.deletePembelian(id);

      if (data.success) {
        if (detail?.id === id) {
          setDetail(null);
          setShowDetail(false);
          setShowEdit(false);
        }

        await muatPembelian();

        setTimeout(() => {
          tampilkanLaporan();
        }, 0);
      } else {
        setPesan(
          data.message || "Gagal menghapus pembelian"
        );
      }
    } catch (err) {
      setPesan(
        err.message || "Gagal menghapus pembelian"
      );
    }
  };

  // ==============================
  // TUTUP MODAL
  // ==============================
  const tutupModal = () => {
    setDetail(null);
    setShowDetail(false);
    setShowEdit(false);
  };

  // ==============================
  // TOTAL PENJUALAN
  // ==============================
  const totalPenjualan = daftarTampil.reduce(
    (total, item) => {
      return total + Number(item.harga || 0);
    },
    0
  );

  return (
    <div className="container-fluid">

      {/* ==============================
          HEADER
      ============================== */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">
            Laporan Penjualan
          </h3>

          <p className="text-muted mb-0">
            Lihat laporan penjualan Batik Singosaren berdasarkan tanggal.
          </p>
        </div>
      </div>

      {/* PESAN ERROR */}
      {pesan && (
        <div className="alert alert-danger">
          {pesan}
        </div>
      )}

      {/* ==============================
          FILTER TANGGAL
      ============================== */}
      <div className="adm-card mb-4">
        <h5 className="fw-bold mb-3">
          Filter Laporan
        </h5>

        <div className="row align-items-end">

          <div className="col-md-4 mb-3">
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

          <div className="col-md-4 mb-3">
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

          <div className="col-md-4 mb-3">
            <div className="d-flex gap-2">

              <button
                type="button"
                className="btn btn-dark"
                onClick={tampilkanLaporan}
              >
                Tampilkan Laporan
              </button>

              <button
                type="button"
                className="btn btn-outline-dark"
                onClick={resetLaporan}
              >
                Reset
              </button>

            </div>
          </div>

        </div>
      </div>

      {/* ==============================
          RINGKASAN
      ============================== */}
      <div className="row mb-4">

        <div className="col-md-6 mb-3">
          <div className="adm-card h-100">
            <small className="text-muted">
              Jumlah Transaksi
            </small>

            <h3 className="fw-bold mb-0">
              {daftarTampil.length}
            </h3>

            <small className="text-muted">
              transaksi pada laporan
            </small>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="adm-card h-100">
            <small className="text-muted">
              Total Penjualan
            </small>

            <h3 className="fw-bold mb-0">
              {formatRupiah(totalPenjualan)}
            </h3>

            <small className="text-muted">
              total harga penjualan
            </small>
          </div>
        </div>

      </div>

      {/* ==============================
          TABEL LAPORAN
      ============================== */}
      <div className="adm-card">

        <div className="d-flex justify-content-between align-items-center mb-3">

          <div>
            <h5 className="fw-bold mb-1">
              Laporan Penjualan
            </h5>

            <small className="text-muted">
              {tanggalMulai || tanggalAkhir
                ? "Data sesuai periode yang dipilih"
                : "Semua data penjualan"}
            </small>
          </div>

          <span className="adm-badge">
            {daftarTampil.length} Transaksi
          </span>

        </div>

        <div className="table-responsive">

          <table className="table adm-table align-middle mb-0">

            <thead>
              <tr>
                <th>ID</th>
                <th>Produk</th>
                <th>Pembeli</th>
                <th>Harga</th>
                <th>Tanggal</th>
                <th>Pembayaran</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>

              {daftarTampil.length === 0 ? (

                <tr>
                  <td
                    colSpan="8"
                    className="text-center text-muted py-4"
                  >
                    Tidak ada penjualan pada periode tersebut.
                  </td>
                </tr>

              ) : (

                daftarTampil.map((item) => (

                  <tr key={item.id}>

                    <td>
                      {item.id}
                    </td>

                    <td className="fw-semibold">
                      {item.nama_produk || "-"}
                    </td>

                    <td>
                      {item.nama_d || "-"}{" "}
                      {item.nama_b || ""}
                    </td>

                    <td>
                      {formatRupiah(item.harga)}
                    </td>

                    <td>
                      {item.created_at
                        ? formatTanggal(item.created_at)
                        : "-"}
                    </td>

                    <td>
                      {item.pembayaran || "-"}
                    </td>

                    <td>
                      <span className="adm-badge">
                        {item.status || "-"}
                      </span>
                    </td>

                    <td>

                      <div className="d-flex gap-1">

                        <button
                          type="button"
                          className="btn btn-sm btn-dark"
                          onClick={() =>
                            lihatDetail(item)
                          }
                        >
                          Detail
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-dark"
                          onClick={() =>
                            mulaiEdit(item)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() =>
                            handleDelete(item.id)
                          }
                        >
                          Hapus
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* ==============================
          MODAL DETAIL
      ============================== */}
      {showDetail && detail && (

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
                  Detail Pembelian
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={tutupModal}
                ></button>

              </div>

              <div className="modal-body">

                <div className="row">

                  <div className="col-md-6">

                    <div className="mb-3">
                      <small className="text-muted">
                        ID Pembelian
                      </small>

                      <p className="mb-0">
                        {detail.id}
                      </p>
                    </div>

                    <div className="mb-3">
                      <small className="text-muted">
                        Produk
                      </small>

                      <p className="mb-0">
                        {detail.nama_produk || "-"}
                      </p>
                    </div>

                    <div className="mb-3">
                      <small className="text-muted">
                        Pembeli
                      </small>

                      <p className="mb-0">
                        {detail.nama_d || "-"}{" "}
                        {detail.nama_b || ""}
                      </p>
                    </div>

                    <div className="mb-3">
                      <small className="text-muted">
                        Email
                      </small>

                      <p className="mb-0">
                        {detail.email || "-"}
                      </p>
                    </div>

                    <div className="mb-3">
                      <small className="text-muted">
                        Harga
                      </small>

                      <p className="mb-0">
                        {formatRupiah(detail.harga)}
                      </p>
                    </div>

                  </div>

                  <div className="col-md-6">

                    <div className="mb-3">
                      <small className="text-muted">
                        Tanggal Pembelian
                      </small>

                      <p className="mb-0">
                        {detail.created_at
                          ? formatTanggal(
                              detail.created_at
                            )
                          : "-"}
                      </p>
                    </div>

                    <div className="mb-3">
                      <small className="text-muted">
                        Metode Pembayaran
                      </small>

                      <p className="mb-0">
                        {detail.metode_pembayaran || "-"}
                      </p>
                    </div>

                    <div className="mb-3">
                      <small className="text-muted">
                        Status Pembayaran
                      </small>

                      <p className="mb-0">
                        {detail.pembayaran || "-"}
                      </p>
                    </div>

                    <div className="mb-3">
                      <small className="text-muted">
                        Status Pesanan
                      </small>

                      <p className="mb-0">
                        {detail.status || "-"}
                      </p>
                    </div>

                  </div>

                </div>

              </div>

              <div className="modal-footer">

                <button
                  type="button"
                  className="btn btn-dark"
                  onClick={() =>
                    mulaiEdit(detail)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() =>
                    handleDelete(detail.id)
                  }
                >
                  Hapus
                </button>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={tutupModal}
                >
                  Tutup
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* ==============================
          MODAL EDIT
      ============================== */}
      {showEdit && detail && (

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
                  Edit Pembelian #{detail.id}
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={tutupModal}
                ></button>

              </div>

              <form onSubmit={handleSubmit}>

                <div className="modal-body">

                  <div className="row">

                    <div className="col-md-4 mb-3">

                      <label className="form-label">
                        Metode Pembayaran
                      </label>

                      <select
                        className="form-select"
                        name="metode_bayar"
                        value={form.metode_bayar}
                        onChange={handleChange}
                      >

                        {METODE_BAYAR.map(
                          (metode) => (
                            <option
                              key={metode}
                              value={metode}
                            >
                              {metode}
                            </option>
                          )
                        )}

                      </select>

                    </div>

                    <div className="col-md-4 mb-3">

                      <label className="form-label">
                        Status Pembayaran
                      </label>

                      <select
                        className="form-select"
                        name="pembayaran"
                        value={form.pembayaran}
                        onChange={handleChange}
                      >

                        {STATUS_BAYAR.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          )
                        )}

                      </select>

                    </div>

                    <div className="col-md-4 mb-3">

                      <label className="form-label">
                        Status Pesanan
                      </label>

                      <select
                        className="form-select"
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                      >

                        {STATUS_PROSES.map(
                          (status) => (
                            <option
                              key={status}
                              value={status}
                            >
                              {status}
                            </option>
                          )
                        )}

                      </select>

                    </div>

                  </div>

                </div>

                <div className="modal-footer">

                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={tutupModal}
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="btn btn-dark"
                    disabled={loading}
                  >
                    {loading
                      ? "Menyimpan..."
                      : "Simpan Perubahan"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
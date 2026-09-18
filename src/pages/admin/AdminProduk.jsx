import { useEffect, useState } from "react";
import { adminApi } from "../../api";
import {
  formatRupiah,
  mediaUrl,
  onImgError,
} from "../../utils";

const FORM_KOSONG = {
  nama_produk: "",
  deskripsi: "",
  harga: "",
  gambar: "",
  kategori: "",
};

export default function AdminProduk() {
  const [daftar, setDaftar] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [form, setForm] = useState(FORM_KOSONG);
  const [fileGambar, setFileGambar] = useState(null);
  const [editId, setEditId] = useState(null);
  const [produkDetail, setProdukDetail] = useState(null);
  const [produkHapus, setProdukHapus] = useState(null);
  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showHapus, setShowHapus] = useState(false);

  // =========================
  // AMBIL PRODUK
  // =========================

  const muatProduk = async () => {
    try {
      const data = await adminApi.getProduk();

      console.log("DATA PRODUK ADMIN:", data);

      if (data.success) {
        setDaftar(
          Array.isArray(data.data)
            ? data.data
            : []
        );
      } else {
        setPesan(
          data.message ||
            "Gagal mengambil data produk"
        );
      }
    } catch (err) {
      console.error(
        "ERROR AMBIL PRODUK:",
        err
      );

      setPesan(
        err.message ||
          "Gagal mengambil data produk"
      );
    }
  };

  // =========================
  // AMBIL KATEGORI
  // =========================

  const muatKategori = async () => {
    try {
      const data = await adminApi.getKategori();

      console.log(
        "DATA KATEGORI ADMIN:",
        data
      );

      if (data.success) {
        setKategori(
          Array.isArray(data.data)
            ? data.data
            : []
        );
      } else {
        setKategori([]);

        setPesan(
          data.message ||
            "Gagal mengambil data kategori"
        );
      }
    } catch (err) {
      console.error(
        "ERROR KATEGORI ADMIN:",
        err
      );

      setKategori([]);

      setPesan(
        err.message ||
          "Gagal mengambil data kategori"
      );
    }
  };

  useEffect(() => {
    muatProduk();
    muatKategori();
  }, []);

  // =========================
  // HANDLE FORM
  // =========================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    console.log(
      "PERUBAHAN FORM:",
      e.target.name,
      "=",
      e.target.value
    );
  };

  const handleGambar = (e) => {
    setFileGambar(
      e.target.files[0] || null
    );
  };

  // =========================
  // TAMBAH
  // =========================

  const mulaiTambah = () => {
    setEditId(null);

    setForm({
      ...FORM_KOSONG,
      kategori:
        kategori.length > 0
          ? kategori[0].nama_kategori
          : "",
    });

    setFileGambar(null);
    setPesan("");
    setShowForm(true);
  };

  // =========================
  // EDIT
  // =========================

  const mulaiEdit = (produk) => {
    console.log(
      "PRODUK YANG DIEDIT:",
      produk
    );

    setEditId(produk.id_produk);

    setForm({
      nama_produk:
        produk.nama_produk || "",
      deskripsi:
        produk.deskripsi || "",
      harga:
        produk.harga || "",
      gambar:
        produk.gambar || "",
      kategori:
        produk.kategori || "",
    });

    setFileGambar(null);
    setPesan("");
    setShowDetail(false);
    setShowForm(true);
  };

  // =========================
  // DETAIL
  // =========================

  const lihatDetail = async (produk) => {
    try {
      setPesan("");

      const data =
        await adminApi.getProdukById(
          produk.id_produk
        );

      console.log(
        "DETAIL PRODUK:",
        data
      );

      setProdukDetail(
        data.success
          ? data.data
          : produk
      );

      setShowDetail(true);
    } catch (err) {
      console.error(
        "ERROR DETAIL PRODUK:",
        err
      );

      setProdukDetail(produk);
      setShowDetail(true);
    }
  };

  // =========================
  // HAPUS
  // =========================

  const mulaiHapus = (produk) => {
    setProdukHapus(produk);
    setShowHapus(true);
    setPesan("");
  };

  // =========================
  // TUTUP MODAL
  // =========================

  const tutupModal = () => {
    setShowForm(false);
    setShowDetail(false);
    setShowHapus(false);

    setEditId(null);
    setProdukDetail(null);
    setProdukHapus(null);

    setForm(FORM_KOSONG);
    setFileGambar(null);
  };

  // =========================
  // SIMPAN PRODUK
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setPesan("");

    try {
      let namaGambar = form.gambar;

      // =========================
      // DEBUG FORM
      // =========================

      console.log(
        "================================"
      );
      console.log(
        "FORM SEBELUM SIMPAN:",
        form
      );
      console.log(
        "KATEGORI YANG DIPILIH:",
        form.kategori
      );
      console.log(
        "EDIT ID:",
        editId
      );
      console.log(
        "================================"
      );

      // =========================
      // UPLOAD GAMBAR
      // =========================

      if (fileGambar) {
        const upload =
          await adminApi.uploadGambar(
            fileGambar
          );

        console.log(
          "HASIL UPLOAD GAMBAR:",
          upload
        );

        if (!upload.success) {
          setPesan(
            upload.message ||
              "Gagal upload gambar"
          );

          setLoading(false);
          return;
        }

        namaGambar = upload.path;

        if (!namaGambar) {
          setPesan(
            "Upload berhasil, tetapi path gambar tidak ditemukan."
          );

          setLoading(false);
          return;
        }
      }

      // =========================
      // DATA YANG DIKIRIM
      // =========================

      const dataForm = {
        nama_produk:
          form.nama_produk,
        deskripsi:
          form.deskripsi,
        harga:
          Number(form.harga),
        gambar:
          namaGambar,
        kategori:
          form.kategori,
      };

      console.log(
        "DATA FORM YANG DIKIRIM:",
        dataForm
      );

      console.log(
        "KATEGORI YANG DIKIRIM:",
        dataForm.kategori
      );

      // =========================
      // UPDATE / CREATE
      // =========================

      const data = editId
        ? await adminApi.updateProduk(
            editId,
            dataForm
          )
        : await adminApi.createProduk(
            dataForm
          );

      console.log(
        "HASIL SIMPAN PRODUK:",
        data
      );

      if (data.success) {
        console.log(
          "PRODUK BERHASIL DISIMPAN"
        );

        tutupModal();

        await muatProduk();
      } else {
        setPesan(
          data.message ||
            "Gagal menyimpan produk"
        );
      }
    } catch (err) {
      console.error(
        "ERROR SIMPAN PRODUK:",
        err
      );

      setPesan(
        err.message ||
          "Gagal menyimpan produk"
      );
    }

    setLoading(false);
  };

  // =========================
  // HAPUS PRODUK
  // =========================

  const handleDelete = async () => {
    if (!produkHapus) return;

    setLoading(true);
    setPesan("");

    try {
      const data =
        await adminApi.deleteProduk(
          produkHapus.id_produk
        );

      console.log(
        "HASIL HAPUS PRODUK:",
        data
      );

      if (data.success) {
        setShowHapus(false);
        setProdukHapus(null);
        setShowDetail(false);
        setProdukDetail(null);

        await muatProduk();
      } else {
        setPesan(
          data.message ||
            "Gagal menghapus produk"
        );
      }
    } catch (err) {
      console.error(
        "ERROR HAPUS PRODUK:",
        err
      );

      setPesan(
        err.message ||
          "Gagal menghapus produk"
      );
    }

    setLoading(false);
  };

  return (
    <div>
      {/* HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            Produk
          </h2>

          <p className="text-muted mb-0">
            Kelola produk Batik Singosaren
          </p>
        </div>

        <button
          className="adm-action-btn adm-action-btn--dark"
          onClick={mulaiTambah}
        >
          <i className="bi bi-plus-lg me-2"></i>
          Tambah Produk
        </button>
      </div>

      {pesan && (
        <div className="alert alert-danger">
          {pesan}
        </div>
      )}

      {/* TABLE */}

      <div className="adm-card">
        <div className="table-responsive">
          <table className="table adm-table align-middle mb-0">
            <thead>
              <tr>
                <th>No</th>
                <th>Gambar</th>
                <th>Nama Produk</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Deskripsi</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {daftar.length > 0 ? (
                daftar.map(
                  (produk, index) => (
                    <tr
                      key={
                        produk.id_produk
                      }
                    >
                      <td>
                        {index + 1}
                      </td>

                      <td>
                        {produk.gambar ? (
                          <img
                            src={mediaUrl(
                              produk.gambar
                            )}
                            onError={
                              onImgError
                            }
                            alt={
                              produk.nama_produk
                            }
                            width="55"
                            height="55"
                            style={{
                              objectFit:
                                "cover",
                              borderRadius:
                                "6px",
                            }}
                          />
                        ) : (
                          <span className="text-muted">
                            Tidak ada
                          </span>
                        )}
                      </td>

                      <td className="fw-semibold">
                        {
                          produk.nama_produk
                        }
                      </td>

                      <td>
                        <span className="adm-badge">
                          {
                            produk.kategori
                          }
                        </span>
                      </td>

                      <td>
                        {formatRupiah(
                          produk.harga
                        )}
                      </td>

                      <td>
                        <span
                          title={
                            produk.deskripsi
                          }
                        >
                          {produk.deskripsi
                            ? `${produk.deskripsi.substring(
                                0,
                                35
                              )}${
                                produk
                                  .deskripsi
                                  .length >
                                35
                                  ? "..."
                                  : ""
                              }`
                            : "-"}
                        </span>
                      </td>

                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() =>
                              lihatDetail(
                                produk
                              )
                            }
                            title="Detail"
                          >
                            <i className="bi bi-eye"></i>
                          </button>

                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() =>
                              mulaiEdit(
                                produk
                              )
                            }
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() =>
                              mulaiHapus(
                                produk
                              )
                            }
                            title="Hapus"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center text-muted py-4"
                  >
                    Belum ada produk
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================
          MODAL TAMBAH / EDIT
      ========================= */}

      {showForm && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{
            background:
              "rgba(0,0,0,.5)",
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <form
                onSubmit={handleSubmit}
              >
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editId
                      ? "Edit Produk"
                      : "Tambah Produk"}
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={
                      tutupModal
                    }
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="row">
                    {/* NAMA */}

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Nama Produk
                      </label>

                      <input
                        type="text"
                        name="nama_produk"
                        className="form-control"
                        value={
                          form.nama_produk
                        }
                        onChange={
                          handleChange
                        }
                        required
                      />
                    </div>

                    {/* KATEGORI */}

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Kategori
                      </label>

                      <select
                        name="kategori"
                        className="form-select"
                        value={
                          form.kategori
                        }
                        onChange={
                          handleChange
                        }
                        required
                      >
                        <option value="">
                          -- Pilih Kategori --
                        </option>

                        {kategori.map(
                          (item) => (
                            <option
                              key={
                                item.id_kategori
                              }
                              value={
                                item.nama_kategori
                              }
                            >
                              {
                                item.nama_kategori
                              }
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {/* HARGA */}

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Harga
                      </label>

                      <input
                        type="number"
                        name="harga"
                        className="form-control"
                        value={
                          form.harga
                        }
                        onChange={
                          handleChange
                        }
                        min="0"
                        required
                      />
                    </div>

                    {/* GAMBAR */}

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Gambar
                      </label>

                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={
                          handleGambar
                        }
                      />
                    </div>

                    {/* GAMBAR LAMA */}

                    {editId &&
                      form.gambar && (
                        <div className="col-md-6 mb-3">
                          <label className="form-label">
                            Gambar Saat Ini
                          </label>

                          <div>
                            <img
                              src={mediaUrl(
                                form.gambar
                              )}
                              onError={
                                onImgError
                              }
                              alt={
                                form.nama_produk
                              }
                              width="120"
                              height="120"
                              style={{
                                objectFit:
                                  "cover",
                                borderRadius:
                                  "6px",
                              }}
                            />
                          </div>
                        </div>
                      )}

                    {/* GAMBAR BARU */}

                    {fileGambar && (
                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Gambar Baru
                        </label>

                        <div>
                          <img
                            src={URL.createObjectURL(
                              fileGambar
                            )}
                            alt="Preview gambar baru"
                            width="120"
                            height="120"
                            style={{
                              objectFit:
                                "cover",
                              borderRadius:
                                "6px",
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* DESKRIPSI */}

                    <div className="col-12 mb-3">
                      <label className="form-label">
                        Deskripsi
                      </label>

                      <textarea
                        name="deskripsi"
                        className="form-control"
                        rows="4"
                        value={
                          form.deskripsi
                        }
                        onChange={
                          handleChange
                        }
                        required
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={
                      tutupModal
                    }
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
                      : editId
                      ? "Simpan Perubahan"
                      : "Tambah Produk"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          MODAL DETAIL
      ========================= */}

      {showDetail &&
        produkDetail && (
          <div
            className="modal d-block"
            tabIndex="-1"
            style={{
              background:
                "rgba(0,0,0,.5)",
            }}
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Detail Produk
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={
                      tutupModal
                    }
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-5 text-center mb-3">
                      {produkDetail.gambar ? (
                        <img
                          src={mediaUrl(
                            produkDetail.gambar
                          )}
                          onError={
                            onImgError
                          }
                          alt={
                            produkDetail.nama_produk
                          }
                          className="img-fluid rounded"
                          style={{
                            maxHeight:
                              "300px",
                            objectFit:
                              "cover",
                          }}
                        />
                      ) : (
                        <div className="text-muted">
                          Tidak ada gambar
                        </div>
                      )}
                    </div>

                    <div className="col-md-7">
                      <h4>
                        {
                          produkDetail.nama_produk
                        }
                      </h4>

                      <p className="mb-2">
                        <strong>
                          Kategori:
                        </strong>{" "}
                        {
                          produkDetail.kategori
                        }
                      </p>

                      <p className="mb-2">
                        <strong>
                          Harga:
                        </strong>{" "}
                        {formatRupiah(
                          produkDetail.harga
                        )}
                      </p>

                      <p className="mb-0">
                        <strong>
                          Deskripsi:
                        </strong>
                        <br />

                        {
                          produkDetail.deskripsi ||
                          "-"
                        }
                      </p>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={
                      tutupModal
                    }
                  >
                    Tutup
                  </button>

                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      mulaiEdit(
                        produkDetail
                      )
                    }
                  >
                    <i className="bi bi-pencil me-1"></i>
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* =========================
          MODAL HAPUS
      ========================= */}

      {showHapus &&
        produkHapus && (
          <div
            className="modal d-block"
            tabIndex="-1"
            style={{
              background:
                "rgba(0,0,0,.5)",
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Hapus Produk
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={
                      tutupModal
                    }
                  ></button>
                </div>

                <div className="modal-body">
                  <p className="mb-0">
                    Apakah kamu yakin
                    ingin menghapus
                    produk{" "}
                    <strong>
                      {
                        produkHapus.nama_produk
                      }
                    </strong>
                    ?
                  </p>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={
                      tutupModal
                    }
                  >
                    Batal
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={
                      handleDelete
                    }
                    disabled={loading}
                  >
                    {loading
                      ? "Menghapus..."
                      : "Hapus"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

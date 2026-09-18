import { useEffect, useState } from "react";
import { adminApi } from "../../api";

export default function AdminKategori() {
  const [kategori, setKategori] = useState([]);
  const [namaKategori, setNamaKategori] = useState("");
  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [pesan, setPesan] = useState("");

  // ==============================
  // AMBIL DATA KATEGORI
  // ==============================
  const muatKategori = async () => {
    try {
      setPesan("");

      const data = await adminApi.getKategori();

      if (data.success) {
        setKategori(Array.isArray(data.data) ? data.data : []);
      } else {
        setPesan(
          data.message || "Gagal mengambil data kategori"
        );
      }
    } catch (err) {
      setPesan(
        err.message || "Gagal mengambil data kategori"
      );
    }
  };

  useEffect(() => {
    muatKategori();
  }, []);

  // ==============================
  // INPUT
  // ==============================
  const handleChange = (e) => {
    setNamaKategori(e.target.value);
  };

  // ==============================
  // TAMBAH / EDIT
  // ==============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const nama = namaKategori.trim();

    if (!nama) {
      setPesan("Nama kategori wajib diisi.");
      return;
    }

    setLoading(true);
    setPesan("");

    try {
      let data;

      if (editId) {
        data = await adminApi.updateKategori(
          editId,
          {
            nama_kategori: nama,
          }
        );
      } else {
        data = await adminApi.createKategori({
          nama_kategori: nama,
        });
      }

      if (data.success) {
        setNamaKategori("");
        setEditId(null);

        await muatKategori();
      } else {
        setPesan(
          data.message ||
            "Gagal menyimpan kategori"
        );
      }
    } catch (err) {
      setPesan(
        err.message ||
          "Gagal menyimpan kategori"
      );
    }

    setLoading(false);
  };

  // ==============================
  // MULAI EDIT
  // ==============================
  const mulaiEdit = (item) => {
    setEditId(item.id_kategori);
    setNamaKategori(item.nama_kategori);
    setPesan("");
  };

  // ==============================
  // BATAL EDIT
  // ==============================
  const batalEdit = () => {
    setEditId(null);
    setNamaKategori("");
    setPesan("");
  };

  // ==============================
  // HAPUS
  // ==============================
  const handleDelete = async (id) => {
    if (
      !confirm(
        "Yakin mau menghapus kategori ini?"
      )
    ) {
      return;
    }

    try {
      setPesan("");

      const data =
        await adminApi.deleteKategori(id);

      if (data.success) {
        if (editId === id) {
          batalEdit();
        }

        await muatKategori();
      } else {
        setPesan(
          data.message ||
            "Gagal menghapus kategori"
        );
      }
    } catch (err) {
      setPesan(
        err.message ||
          "Gagal menghapus kategori"
      );
    }
  };

  return (
    <div className="container-fluid">

      {/* HEADER */}
      <div className="mb-4">
        <h3 className="mb-1">
          Kelola Kategori
        </h3>

        <p className="text-muted mb-0">
          Kelola kategori produk Batik Singosaren.
        </p>
      </div>

      {/* PESAN */}
      {pesan && (
        <div className="alert alert-danger">
          {pesan}
        </div>
      )}

      {/* FORM */}
      <div className="adm-card mb-4">

        <h5 className="fw-bold mb-3">
          {editId
            ? "Edit Kategori"
            : "Tambah Kategori"}
        </h5>

        <form onSubmit={handleSubmit}>

          <div className="row align-items-end">

            <div className="col-md-8 mb-3">

              <label className="form-label">
                Nama Kategori
              </label>

              <input
                type="text"
                className="form-control"
                value={namaKategori}
                onChange={handleChange}
                placeholder="Masukkan nama kategori"
                required
              />

            </div>

            <div className="col-md-4 mb-3">

              <div className="d-flex gap-2">

                <button
                  type="submit"
                  className="btn btn-dark"
                  disabled={loading}
                >
                  {loading
                    ? "Menyimpan..."
                    : editId
                    ? "Simpan Perubahan"
                    : "Tambah Kategori"}
                </button>

                {editId && (
                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={batalEdit}
                  >
                    Batal
                  </button>
                )}

              </div>

            </div>

          </div>

        </form>

      </div>

      {/* TABEL */}
      <div className="adm-card">

        <div className="d-flex justify-content-between align-items-center mb-3">

          <h5 className="fw-bold mb-0">
            Daftar Kategori
          </h5>

          <span className="adm-badge">
            {kategori.length} Kategori
          </span>

        </div>

        <div className="table-responsive">

          <table className="table adm-table align-middle mb-0">

            <thead>
              <tr>
                <th width="100">ID</th>
                <th>Nama Kategori</th>
                <th width="180">Aksi</th>
              </tr>
            </thead>

            <tbody>

              {kategori.length === 0 ? (

                <tr>
                  <td
                    colSpan="3"
                    className="text-center text-muted py-4"
                  >
                    Belum ada kategori
                  </td>
                </tr>

              ) : (

                kategori.map((item) => (

                  <tr key={item.id_kategori}>

                    <td>
                      {item.id_kategori}
                    </td>

                    <td className="fw-semibold">
                      {item.nama_kategori}
                    </td>

                    <td>

                      <div className="d-flex gap-1">

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
                            handleDelete(
                              item.id_kategori
                            )
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

    </div>
  );
}
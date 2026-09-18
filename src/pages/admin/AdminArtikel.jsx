import { useEffect, useState } from "react";
import { adminApi } from "../../api";
import { mediaUrl, onImgError, formatTanggal } from "../../utils";

export default function AdminArtikel() {
  const [artikel, setArtikel] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    judul: "",
    ringkasan: "",
    isi: "",
    gambar: "",
  });

  const [editId, setEditId] = useState(null);
  const [gambarFile, setGambarFile] = useState(null);

  const ambilArtikel = async () => {
    try {
      const response = await adminApi.getArtikel();

      if (response.success && Array.isArray(response.data)) {
        setArtikel(response.data);
      } else {
        setArtikel([]);
      }
    } catch (error) {
      console.error("Gagal mengambil artikel:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ambilArtikel();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let namaGambar = form.gambar;

      if (gambarFile) {
        const upload = await adminApi.uploadGambar(gambarFile);

        if (!upload.success) {
          alert(upload.message || "Upload gambar gagal");
          return;
        }

        namaGambar = upload.path;
      }

      const data = {
        judul: form.judul,
        ringkasan: form.ringkasan,
        isi: form.isi,
        gambar: namaGambar,
      };

      if (editId) {
        await adminApi.updateArtikel(editId, data);
        alert("Artikel berhasil diperbarui");
      } else {
        await adminApi.createArtikel(data);
        alert("Artikel berhasil ditambahkan");
      }

      resetForm();
      ambilArtikel();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const editArtikel = (item) => {
    setEditId(item.id);

    setForm({
      judul: item.judul || "",
      ringkasan: item.ringkasan || "",
      isi: item.isi || "",
      gambar: item.gambar || "",
    });

    setGambarFile(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const hapusArtikel = async (id) => {
    const yakin = window.confirm(
      "Yakin ingin menghapus artikel ini?"
    );

    if (!yakin) return;

    try {
      await adminApi.deleteArtikel(id);

      alert("Artikel berhasil dihapus");

      ambilArtikel();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const resetForm = () => {
    setEditId(null);

    setForm({
      judul: "",
      ringkasan: "",
      isi: "",
      gambar: "",
    });

    setGambarFile(null);
  };

  return (
    <div
      className="container-fluid py-4"
      style={{
        background: "#faf8f4",
        minHeight: "100vh",
      }}
    >

      {/* JUDUL */}
      <div className="mb-4">
        <h2 style={{ color: "#5d4037", fontWeight: "700" }}>
          Kelola Artikel
        </h2>

        <p style={{ color: "#75685f" }}>
          Tambah, edit, dan hapus artikel Batik Singosaren.
        </p>
      </div>


      {/* FORM */}
      <div
        className="card border-0 shadow-sm mb-4"
        style={{ borderRadius: "12px" }}
      >
        <div className="card-body p-4">

          <h5
            className="mb-4"
            style={{
              color: "#5d4037",
              fontWeight: "700",
            }}
          >
            {editId ? "Edit Artikel" : "Tambah Artikel"}
          </h5>

          <form onSubmit={handleSubmit}>

            {/* JUDUL */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Judul Artikel
              </label>

              <input
                type="text"
                name="judul"
                value={form.judul}
                onChange={handleChange}
                className="form-control"
                placeholder="Masukkan judul artikel"
                required
              />
            </div>


            {/* RINGKASAN */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Ringkasan
              </label>

              <textarea
                name="ringkasan"
                value={form.ringkasan}
                onChange={handleChange}
                className="form-control"
                rows="3"
                placeholder="Masukkan ringkasan artikel"
                required
              />
            </div>


            {/* ISI */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Isi Artikel
              </label>

              <textarea
                name="isi"
                value={form.isi}
                onChange={handleChange}
                className="form-control"
                rows="8"
                placeholder="Masukkan isi artikel"
                required
              />
            </div>


            {/* GAMBAR */}
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Gambar
              </label>

              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={(e) =>
                  setGambarFile(e.target.files[0] || null)
                }
              />
            </div>


            {/* GAMBAR LAMA */}
            {form.gambar && !gambarFile && (
              <div className="mb-3">
                <p
                  className="mb-2"
                  style={{ color: "#75685f" }}
                >
                  Gambar saat ini:
                </p>

                <img
                  src={mediaUrl(form.gambar)}
                  onError={onImgError}
                  alt={form.judul}
                  style={{
                    width: "180px",
                    height: "120px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>
            )}


            {/* BUTTON */}
            <div className="d-flex gap-2">

              <button
                type="submit"
                className="btn"
                style={{
                  background: "#5d4037",
                  color: "#fff",
                }}
              >
                {editId ? "Simpan Perubahan" : "Tambah Artikel"}
              </button>

              {editId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Batal
                </button>
              )}

            </div>

          </form>
        </div>
      </div>


      {/* DAFTAR ARTIKEL */}
      <div
        className="card border-0 shadow-sm"
        style={{ borderRadius: "12px" }}
      >
        <div className="card-body p-4">

          <h5
            className="mb-4"
            style={{
              color: "#5d4037",
              fontWeight: "700",
            }}
          >
            Daftar Artikel
          </h5>

          {loading ? (
            <p>Memuat artikel...</p>
          ) : artikel.length === 0 ? (
            <p style={{ color: "#75685f" }}>
              Belum ada artikel.
            </p>
          ) : (
            <div className="table-responsive">

              <table className="table align-middle">

                <thead>
                  <tr>
                    <th>No</th>
                    <th>Gambar</th>
                    <th>Judul</th>
                    <th>Ringkasan</th>
                    <th>Tanggal</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>

                  {artikel.map((item, index) => (
                    <tr key={item.id}>

                      <td>{index + 1}</td>

                      <td>
                        {item.gambar ? (
                          <img
                            src={mediaUrl(item.gambar)}
                            onError={onImgError}
                            alt={item.judul}
                            style={{
                              width: "80px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "6px",
                            }}
                          />
                        ) : (
                          <span>-</span>
                        )}
                      </td>

                      <td>
                        <strong>
                          {item.judul}
                        </strong>
                      </td>

                      <td>
                        <span>
                          {item.ringkasan}
                        </span>
                      </td>

                      <td>
                        {formatTanggal(item.created_at)}
                      </td>

                      <td>
                        <div className="d-flex gap-2">

                          <button
                            className="btn btn-sm"
                            style={{
                              background: "#8a6a52",
                              color: "#fff",
                            }}
                            onClick={() =>
                              editArtikel(item)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              hapusArtikel(item.id)
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

    </div>
  );
}

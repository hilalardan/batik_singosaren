import { useEffect, useState } from "react";
import { adminApi } from "../../api";
import { useAdminGuard } from "../../hooks";
import { formatTanggal } from "../../utils";

const FORM_KOSONG = {
  nama_d: "",
  nama_b: "",
  email: "",
  uname: "",
  passwd: "",
  phone: "",
  alamat: "",
  kelamin: "",
  lahir: "",
};

export default function AdminPembeli() {
  const { handleError } = useAdminGuard();

  const [daftar, setDaftar] = useState([]);
  const [form, setForm] = useState(FORM_KOSONG);
  const [detail, setDetail] = useState(null);
  const [editId, setEditId] = useState(null);
  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const namaLengkap = (item) =>
    [item.nama_d, item.nama_b].filter(Boolean).join(" ") || "-";

  const muatPembeli = async () => {
    try {
      setPesan("");

      const data = await adminApi.getPembeli();

      if (data.success) {
        setDaftar(data.data || []);
      } else {
        setPesan(data.message || "Gagal mengambil data pembeli");
      }
    } catch (err) {
      if (!handleError(err)) {
        setPesan(err.message || "Gagal mengambil data pembeli");
      }
    }
  };

  useEffect(() => {
    muatPembeli();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const tambahPembeli = () => {
    setForm(FORM_KOSONG);
    setEditId(null);
    setDetail(null);
    setShowDetail(false);
    setShowForm(true);
    setPesan("");
  };

  const editPembeli = (item) => {
    setForm({
      nama_d: item.nama_d || "",
      nama_b: item.nama_b || "",
      email: item.email || "",
      uname: item.uname || "",
      passwd: "",
      phone: item.phone || "",
      alamat: item.alamat || "",
      kelamin: item.kelamin || "",
      lahir: item.lahir || "",
    });

    setEditId(item.id);
    setDetail(null);
    setShowDetail(false);
    setShowForm(true);
    setPesan("");
  };

  const lihatDetail = async (item) => {
    try {
      setPesan("");

      const data = await adminApi.getPembeliById(item.id);

      if (data.success) {
        setDetail(data.data);
        setShowDetail(true);
        setShowForm(false);
      } else {
        setPesan(data.message || "Gagal mengambil detail pembeli");
      }
    } catch (err) {
      if (!handleError(err)) {
        setPesan(err.message || "Gagal mengambil detail pembeli");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nama_d || !form.uname || !form.email) {
      setPesan("Nama depan, username, dan email wajib diisi.");
      return;
    }

    if (!editId && !form.passwd) {
      setPesan("Password wajib diisi untuk pembeli baru.");
      return;
    }

    setLoading(true);
    setPesan("");

    try {
      const payload = {
        nama_d: form.nama_d,
        nama_b: form.nama_b,
        email: form.email,
        uname: form.uname,
        phone: form.phone,
        alamat: form.alamat,
        kelamin: form.kelamin,
        lahir: form.lahir,
      };

      if (form.passwd) {
        payload.passwd = form.passwd;
      }

      const data = editId
        ? await adminApi.updatePembeli(editId, payload)
        : await adminApi.createPembeli({
            ...payload,
            passwd: form.passwd,
          });

      if (data.success) {
        setShowForm(false);
        setEditId(null);
        setForm(FORM_KOSONG);
        await muatPembeli();
      } else {
        setPesan(data.message || "Gagal menyimpan data pembeli");
      }
    } catch (err) {
      if (!handleError(err)) {
        setPesan(err.message || "Gagal menyimpan data pembeli");
      }
    }

    setLoading(false);
  };

  const hapusPembeli = async (id) => {
    if (!confirm("Yakin mau menghapus pembeli ini?")) return;

    try {
      setPesan("");

      const data = await adminApi.deletePembeli(id);

      if (data.success) {
        if (detail?.id === id) {
          setDetail(null);
          setShowDetail(false);
        }

        await muatPembeli();
      } else {
        setPesan(data.message || "Gagal menghapus pembeli");
      }
    } catch (err) {
      if (!handleError(err)) {
        setPesan(err.message || "Gagal menghapus pembeli");
      }
    }
  };

  const tutupForm = () => {
    setShowForm(false);
    setEditId(null);
    setForm(FORM_KOSONG);
    setPesan("");
  };

  const tutupDetail = () => {
    setShowDetail(false);
    setDetail(null);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="adm-topbar-title mb-1">Data Pembeli</h1>
          <p className="text-muted mb-0">
            Kelola data pembeli Batik Singosaren.
          </p>
        </div>

        <button
          className="adm-action-btn adm-action-btn--dark"
          onClick={tambahPembeli}
        >
          <i className="bi bi-plus-lg me-1"></i>
          Tambah Pembeli
        </button>
      </div>

      {pesan && <div className="alert alert-danger mb-4">{pesan}</div>}

      <div className="adm-card">
        <div className="table-responsive">
          <table className="table adm-table align-middle mb-0">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Username</th>
                <th>Email</th>
                <th>No. HP</th>
                <th>Terdaftar</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {daftar.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    Belum ada data pembeli.
                  </td>
                </tr>
              ) : (
                daftar.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>

                    <td>
                      <strong>{namaLengkap(item)}</strong>
                    </td>

                    <td>{item.uname || "-"}</td>

                    <td>{item.email || "-"}</td>

                    <td>{item.phone || "-"}</td>

                    <td>{formatTanggal(item.created_at)}</td>

                    <td>
                      <div className="d-flex gap-1">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => lihatDetail(item)}
                          title="Detail"
                        >
                          <i className="bi bi-eye"></i>
                        </button>

                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => editPembeli(item)}
                          title="Edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => hapusPembeli(item.id)}
                          title="Hapus"
                        >
                          <i className="bi bi-trash"></i>
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

      {showForm && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editId ? "Edit Pembeli" : "Tambah Pembeli"}
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={tutupForm}
                ></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {pesan && <div className="alert alert-danger">{pesan}</div>}

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Nama Depan</label>
                      <input
                        type="text"
                        name="nama_d"
                        className="form-control"
                        value={form.nama_d}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Nama Belakang</label>
                      <input
                        type="text"
                        name="nama_b"
                        className="form-control"
                        value={form.nama_b}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Username</label>
                      <input
                        type="text"
                        name="uname"
                        className="form-control"
                        value={form.uname}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={form.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Password {editId && "(kosongkan jika tidak diubah)"}
                      </label>
                      <input
                        type="password"
                        name="passwd"
                        className="form-control"
                        value={form.passwd}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">No. HP</label>
                      <input
                        type="text"
                        name="phone"
                        className="form-control"
                        value={form.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Jenis Kelamin</label>
                      <select
                        name="kelamin"
                        className="form-select"
                        value={form.kelamin}
                        onChange={handleChange}
                      >
                        <option value="">Pilih</option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Tanggal Lahir</label>
                      <input
                        type="date"
                        name="lahir"
                        className="form-control"
                        value={form.lahir ? form.lahir.substring(0, 10) : ""}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Alamat</label>
                      <textarea
                        name="alamat"
                        className="form-control"
                        rows="2"
                        value={form.alamat}
                        onChange={handleChange}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={tutupForm}
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="btn btn-dark"
                    disabled={loading}
                  >
                    {loading ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showDetail && detail && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detail Pembeli</h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={tutupDetail}
                ></button>
              </div>

              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <small className="text-muted">Nama Lengkap</small>
                    <div className="fw-semibold">
                      {namaLengkap(detail)}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted">Username</small>
                    <div className="fw-semibold">
                      {detail.uname || "-"}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted">Email</small>
                    <div>{detail.email || "-"}</div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted">No. HP</small>
                    <div>{detail.phone || "-"}</div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted">Jenis Kelamin</small>
                    <div>{detail.kelamin || "-"}</div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted">Tanggal Lahir</small>
                    <div>{formatTanggal(detail.lahir)}</div>
                  </div>

                  <div className="col-12">
                    <small className="text-muted">Alamat</small>
                    <div>{detail.alamat || "-"}</div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted">Tanggal Daftar</small>
                    <div>{formatTanggal(detail.created_at)}</div>
                  </div>

                  <div className="col-md-6">
                    <small className="text-muted">ID Pembeli</small>
                    <div>{detail.id}</div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={tutupDetail}>
                  Tutup
                </button>

                <button
                  className="btn btn-dark"
                  onClick={() => editPembeli(detail)}
                >
                  <i className="bi bi-pencil me-1"></i>
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
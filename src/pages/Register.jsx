import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";
import { KELAMIN } from "../constants";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    uname: "",
    email: "",
    nama_d: "",
    nama_b: "",
    kelamin: KELAMIN[0],
    lahir: "",
    alamat: "",
    phone: "",
    passwd: "",
    passwd_confirm: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (form.passwd !== form.passwd_confirm) {
      setMessage("Password dan konfirmasi password tidak sama.");
      return;
    }

    setLoading(true);

    try {
      const { passwd_confirm, ...payload } = form;

      const data = await api.register(payload);

      if (data.success) {
        alert("Registrasi berhasil!");
        navigate("/login");
      } else {
        setMessage(data.message || "Registrasi gagal.");
      }
    } catch (error) {
      setMessage(error.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div
              className="card border-0 shadow-sm"
              style={{ backgroundColor: "#fffdf8" }}
            >
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold">Daftar Akun</h2>
                  <p className="text-muted">
                    Buat akun untuk berbelanja di Batik Singosaren.
                  </p>
                </div>

                {message && (
                  <div className="alert alert-danger">
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Username</label>
                      <input
                        type="text"
                        name="uname"
                        className="form-control"
                        value={form.uname}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nama Depan</label>
                      <input
                        type="text"
                        name="nama_d"
                        className="form-control"
                        value={form.nama_d}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nama Belakang</label>
                      <input
                        type="text"
                        name="nama_b"
                        className="form-control"
                        value={form.nama_b}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Jenis Kelamin</label>
                    <select
                      name="kelamin"
                      className="form-select"
                      value={form.kelamin}
                      onChange={handleChange}
                    >
                      {KELAMIN.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Tanggal Lahir</label>
                    <input
                      type="date"
                      name="lahir"
                      className="form-control"
                      value={form.lahir}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Alamat</label>
                    <textarea
                      name="alamat"
                      className="form-control"
                      rows="3"
                      value={form.alamat}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Nomor HP</label>
                    <input
                      type="text"
                      name="phone"
                      className="form-control"
                      value={form.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      name="passwd"
                      className="form-control"
                      value={form.passwd}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">
                      Konfirmasi Password
                    </label>
                    <input
                      type="password"
                      name="passwd_confirm"
                      className="form-control"
                      value={form.passwd_confirm}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn w-100 text-white"
                    style={{ backgroundColor: "#6b4226" }}
                    disabled={loading}
                  >
                    {loading ? "Mendaftarkan..." : "Daftar"}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p className="mb-0">
                    Sudah punya akun?{" "}
                    <Link to="/login" style={{ color: "#6b4226" }}>
                      Login sekarang
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;
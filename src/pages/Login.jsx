import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { SITE } from "../constants";

function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    credential: "",
    passwd: "",
  });

  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setPesan("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Simpan token
        localStorage.setItem("toko_token", data.token);

        // Ambil role dari response backend
        const role = String(
          data.user?.role || data.role || ""
        ).toLowerCase();

        console.log("Role login:", role);
        console.log("Data login:", data);

        setPesan("Login berhasil!");

        // Redirect berdasarkan role
        if (role === "admin") {
          navigate("/admin");
        } else if (role === "pembeli") {
          navigate("/user");
        } else {
          setPesan("Role user tidak dikenali.");
        }
      } else {
        setPesan(data.message || "Login gagal");
      }
    } catch (error) {
      console.error(error);
      setPesan("Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-fluid min-vh-100">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-12 col-md-6 col-lg-4">

          <div className="text-center mb-4">
            <h2 className="fw-bold">
              {SITE.nama_toko}
            </h2>

            <p className="text-muted">
              Silakan login untuk melanjutkan
            </p>
          </div>

          <div
            className="border rounded-4 p-4 shadow-sm"
            style={{ backgroundColor: "#fffdf8" }}
          >
            <h4 className="fw-bold mb-4">
              Login
            </h4>

            {pesan && (
              <div
                className={`alert ${
                  pesan === "Login berhasil!"
                    ? "alert-success"
                    : "alert-danger"
                }`}
              >
                {pesan}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label
                  htmlFor="credential"
                  className="form-label"
                >
                  Email / Username
                </label>

                <input
                  id="credential"
                  type="text"
                  className="form-control"
                  name="credential"
                  value={form.credential}
                  onChange={handleChange}
                  placeholder="Email atau username"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="passwd"
                  className="form-label"
                >
                  Password
                </label>

                <input
                  id="passwd"
                  type="password"
                  className="form-control"
                  name="passwd"
                  value={form.passwd}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn w-100 text-white"
                style={{ backgroundColor: "#6b4226" }}
                disabled={loading}
              >
                {loading ? "Memproses..." : "Login"}
              </button>

            </form>

            <div className="text-center mt-4">
              <p className="text-muted mb-1">
                Belum punya akun?
              </p>

              <Link
                to="/register"
                className="text-dark fw-bold text-decoration-none"
              >
                Daftar sekarang
              </Link>
            </div>

            <div className="text-center mt-3">
              <Link
                to="/"
                className="text-muted text-decoration-none"
              >
                Kembali ke Beranda
              </Link>
            </div>

          </div>

          <p className="text-center text-muted small mt-4">
            © 2026 {SITE.nama_toko}
          </p>

        </div>
      </div>
    </div>
  );
}

export default LoginPage;

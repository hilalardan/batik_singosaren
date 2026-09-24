import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { pembeliApi } from "../api";
import { METODE_BAYAR, SHIPPING } from "../constants";
import { mediaUrl, onImgError } from "../utils";

function Cart() {
  const navigate = useNavigate();
  const location = useLocation();
  const isUserArea = location.pathname.startsWith("/user");

  const [keranjang, setKeranjang] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    nama_pembeli: "",
    phone_pembeli: "",
    alamat_pembeli: "",
    metode_pembayaran: METODE_BAYAR[0],
    pengiriman: SHIPPING[0],
    catatan: "",
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("keranjang") || "[]");
    setKeranjang(data);

    const token = localStorage.getItem("toko_token");
    if (!token) return;

    pembeliApi.getMe()
      .then((response) => {
        console.log("DATA USER:", response);

        const user =
          response?.data?.user ||
          response?.data ||
          response?.user ||
          response;

        console.log("USER:", user);

        const nama =
          user?.nama_pembeli ||
          user?.nama_lengkap ||
          user?.nama ||
          user?.name ||
          user?.username ||
          "";

        setForm((prev) => ({
          ...prev,
          nama_pembeli: nama,
        }));
      })
      .catch((error) => {
        console.error("Gagal mengambil data pembeli:", error);
      });
  }, []);

  const simpanKeranjang = (data) => {
    setKeranjang(data);
    localStorage.setItem("keranjang", JSON.stringify(data));
  };

  const tambahJumlah = (id) => {
    simpanKeranjang(
      keranjang.map((item) =>
        item.id_produk === id
          ? { ...item, jumlah: item.jumlah + 1 }
          : item
      )
    );
  };

  const kurangiJumlah = (id) => {
    simpanKeranjang(
      keranjang
        .map((item) =>
          item.id_produk === id
            ? { ...item, jumlah: item.jumlah - 1 }
            : item
        )
        .filter((item) => item.jumlah > 0)
    );
  };

  const hapusProduk = (id) => {
    simpanKeranjang(
      keranjang.filter((item) => item.id_produk !== id)
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const total = keranjang.reduce(
    (sum, item) => sum + Number(item.harga) * Number(item.jumlah),
    0
  );

  const jumlahProduk = keranjang.reduce(
    (sum, item) => sum + Number(item.jumlah),
    0
  );

  const bukaCheckout = () => {
    const token = localStorage.getItem("toko_token");

    if (!token) {
      alert("Silakan login terlebih dahulu.");
      navigate("/login", {
        state: { from: isUserArea ? "/user/cart" : "/cart" },
      });
      return;
    }

    if (keranjang.length === 0) {
      alert("Keranjang masih kosong.");
      return;
    }

    setMessage("");
    setShowCheckout(true);
  };

  const tutupCheckout = () => {
    if (!loading) {
      setShowCheckout(false);
      setMessage("");
    }
  };

  const validasiForm = () => {
    const nama = form.nama_pembeli.trim();
    const phone = form.phone_pembeli.trim();
    const alamat = form.alamat_pembeli.trim();

    if (!nama) return "Nama lengkap wajib diisi.";
    if (!phone) return "Nomor telepon wajib diisi.";
    if (!/^[0-9]+$/.test(phone)) return "Nomor telepon hanya boleh berisi angka.";
    if (phone.length < 10) return "Nomor telepon minimal 10 digit.";
    if (!alamat) return "Alamat wajib diisi.";
    if (!form.metode_pembayaran) return "Metode pembayaran wajib dipilih.";
    if (!form.pengiriman) return "Pengiriman wajib dipilih.";
    if (keranjang.length === 0) return "Keranjang masih kosong.";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const errorValidasi = validasiForm();
    if (errorValidasi) {
      setMessage(errorValidasi);
      return;
    }

    setLoading(true);

    try {
      for (const item of keranjang) {
        const response = await pembeliApi.createPembelian({
          id_produk: item.id_produk,
          jumlah: item.jumlah,
          nama_pembeli: form.nama_pembeli.trim(),
          phone_pembeli: form.phone_pembeli.trim(),
          alamat_pembeli: form.alamat_pembeli.trim(),
          metode_pembayaran: form.metode_pembayaran,
          pengiriman: form.pengiriman,
          catatan: form.catatan.trim(),
        });

        if (!response.success) {
          throw new Error(response.message || "Gagal membuat pesanan.");
        }
      }

      alert("Pesanan berhasil dibuat!");
      localStorage.removeItem("keranjang");
      setKeranjang([]);
      setShowCheckout(false);

      setForm((prev) => ({
        ...prev,
        phone_pembeli: "",
        alamat_pembeli: "",
        metode_pembayaran: METODE_BAYAR[0],
        pengiriman: SHIPPING[0],
        catatan: "",
      }));

      navigate(isUserArea ? "/user/pesanan" : "/pesanan");
    } catch (error) {
      console.error("Gagal membuat pesanan:", error);
      setMessage(
        error.message ||
        "Gagal membuat pesanan. Pastikan sudah login dan backend berjalan."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <p className="text-warning fw-bold mb-1">BELANJA</p>
            <h2 className="fw-bold">Keranjang Belanja</h2>
            <p className="text-muted">
              Periksa kembali produk yang ingin kamu beli.
            </p>
          </div>

          {keranjang.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-3" style={{ fontSize: "60px" }}>🛒</div>
              <h4 className="fw-bold">Keranjang masih kosong</h4>
              <p className="text-muted">Yuk pilih produk batik terlebih dahulu.</p>
              <Link
                to={isUserArea ? "/user/toko" : "/toko"}
                className="btn btn-warning px-4"
              >
                Belanja Sekarang
              </Link>
            </div>
          ) : (
            <div className="row g-4">
              <div className="col-lg-8">
                {keranjang.map((item) => (
                  <div key={item.id_produk} className="card border-0 shadow-sm mb-3">
                    <div className="card-body">
                      <div className="row align-items-center g-3">
                        <div className="col-md-5">
                          <div className="d-flex align-items-center gap-3">
                            <img
                              src={mediaUrl(item.gambar)}
                              onError={onImgError}
                              alt={item.nama_produk}
                              className="rounded"
                              style={{ width: "85px", height: "85px", objectFit: "cover" }}
                            />
                            <div>
                              <p className="text-warning small fw-bold mb-1">{item.kategori}</p>
                              <h5 className="fw-bold mb-1">{item.nama_produk}</h5>
                              <p className="text-muted mb-0">
                                Rp {Number(item.harga).toLocaleString("id-ID")}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-2 text-center">
                          <small className="text-muted d-block mb-2">Jumlah</small>
                          <div className="d-flex justify-content-center align-items-center">
                            <button
                              type="button"
                              className="btn btn-outline-dark btn-sm"
                              onClick={() => kurangiJumlah(item.id_produk)}
                            >
                              −
                            </button>
                            <span className="px-3 fw-bold" style={{ minWidth: "40px" }}>
                              {item.jumlah}
                            </span>
                            <button
                              type="button"
                              className="btn btn-outline-dark btn-sm"
                              onClick={() => tambahJumlah(item.id_produk)}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="col-md-3 text-center">
                          <small className="text-muted d-block mb-1">Subtotal</small>
                          <strong>
                            Rp {(Number(item.harga) * Number(item.jumlah)).toLocaleString("id-ID")}
                          </strong>
                        </div>

                        <div className="col-md-2 text-md-end">
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => hapusProduk(item.id_produk)}
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Link
                  to={isUserArea ? "/user/toko" : "/toko"}
                  className="btn btn-outline-dark"
                >
                  ← Lanjut Belanja
                </Link>
              </div>

              <div className="col-lg-4">
                <div className="card border-0 shadow-sm">
                  <div className="card-body p-4">
                    <h4 className="fw-bold mb-4">Ringkasan Belanja</h4>

                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-muted">Jumlah Produk</span>
                      <span>{jumlahProduk}</span>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between mb-4">
                      <strong>Total</strong>
                      <strong className="text-warning">
                        Rp {total.toLocaleString("id-ID")}
                      </strong>
                    </div>

                    <button
                      type="button"
                      onClick={bukaCheckout}
                      className="btn btn-warning w-100 fw-bold"
                    >
                      Pesan Sekarang
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {showCheckout && (
        <div
          className="modal d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4">

              <div className="modal-header">
                <div>
                  <h4 className="modal-title fw-bold">Checkout</h4>
                  <small className="text-muted">Lengkapi data pesanan kamu</small>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={tutupCheckout}
                  disabled={loading}
                ></button>
              </div>

              <div className="modal-body">
                {message && <div className="alert alert-danger">{message}</div>}

                <div className="row g-4">
                  <div className="col-md-7">
                    <h5 className="fw-bold mb-3">Data Pembeli</h5>

                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label fw-bold">Nama Lengkap</label>
                        <input
                          type="text"
                          name="nama_pembeli"
                          className="form-control"
                          value={form.nama_pembeli}
                          readOnly
                          placeholder="Nama pembeli"
                          required
                        />
                        <small className="text-muted">
                          Nama otomatis dari akun yang sedang login.
                        </small>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-bold">Nomor Telepon</label>
                        <input
                          type="text"
                          name="phone_pembeli"
                          className="form-control"
                          value={form.phone_pembeli}
                          onChange={handleChange}
                          placeholder="Masukkan nomor telepon"
                          inputMode="numeric"
                          maxLength="15"
                          disabled={loading}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-bold">Alamat</label>
                        <textarea
                          name="alamat_pembeli"
                          className="form-control"
                          rows="3"
                          value={form.alamat_pembeli}
                          onChange={handleChange}
                          placeholder="Masukkan alamat lengkap"
                          disabled={loading}
                          required
                        ></textarea>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-bold">Metode Pembayaran</label>
                        <select
                          name="metode_pembayaran"
                          className="form-select"
                          value={form.metode_pembayaran}
                          onChange={handleChange}
                          disabled={loading}
                          required
                        >
                          {METODE_BAYAR.map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-bold">Pengiriman</label>
                        <select
                          name="pengiriman"
                          className="form-select"
                          value={form.pengiriman}
                          onChange={handleChange}
                          disabled={loading}
                          required
                        >
                          {SHIPPING.map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-bold">Catatan</label>
                        <textarea
                          name="catatan"
                          className="form-control"
                          rows="2"
                          value={form.catatan}
                          onChange={handleChange}
                          placeholder="Catatan tambahan, jika ada"
                          disabled={loading}
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-warning w-100 fw-bold"
                        disabled={loading}
                      >
                        {loading ? "Memproses..." : "Bayar"}
                      </button>
                    </form>
                  </div>

                  <div className="col-md-5">
                    <div className="bg-light rounded-4 p-3">
                      <h5 className="fw-bold mb-3">Pesanan Kamu</h5>

                      {keranjang.map((item) => (
                        <div key={item.id_produk} className="d-flex gap-2 mb-3">
                          <img
                            src={mediaUrl(item.gambar)}
                            onError={onImgError}
                            alt={item.nama_produk}
                            className="rounded"
                            style={{ width: "55px", height: "55px", objectFit: "cover" }}
                          />

                          <div className="flex-grow-1">
                            <p className="fw-bold small mb-1">{item.nama_produk}</p>
                            <small className="text-muted">
                              {item.jumlah} × Rp {Number(item.harga).toLocaleString("id-ID")}
                            </small>
                          </div>
                        </div>
                      ))}

                      <hr />

                      <div className="d-flex justify-content-between">
                        <strong>Total</strong>
                        <strong className="text-warning">
                          Rp {total.toLocaleString("id-ID")}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Cart;

import { Link } from "react-router-dom";
import { useBerandaData } from "../hooks";
import { SITE } from "../constants";
import { mediaUrl, formatRupiah, onImgError } from "../utils";

export default function HomePage() {
  const { produkTerbaru, kategoriList } = useBerandaData();

  const deskripsi = {
    "Batik Tulis":
      "Keindahan motif yang dibuat dengan ketelitian dan sentuhan tangan.",
    "Batik Cap":
      "Motif khas dengan proses pembuatan yang rapi dan berkarakter.",
    "Batik Kombinasi":
      "Perpaduan teknik tradisional dengan sentuhan yang lebih modern.",
  };

  return (
    <>
      {/* HERO */}
      <section
        style={{
          minHeight: "600px",
          backgroundImage:
            "linear-gradient(90deg, rgba(48,37,31,0.88) 0%, rgba(48,37,31,0.68) 45%, rgba(48,37,31,0.25) 100%), url('/bgh.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <p
                className="fw-bold mb-3"
                style={{
                  color: "#c9d2a8",
                  letterSpacing: "3px",
                  fontSize: "13px",
                }}
              >
                BATIK SINGOSAREN
              </p>

              <h1
                className="fw-bold mb-4 text-white"
                style={{
                  fontSize: "clamp(45px, 7vw, 78px)",
                  lineHeight: "1.05",
                }}
              >
                Warisan Batik,
                <br />
                Gaya Masa Kini.
              </h1>

              <p
                className="mb-4 text-white"
                style={{
                  maxWidth: "600px",
                  fontSize: "17px",
                  lineHeight: "1.8",
                  opacity: 0.9,
                }}
              >
                Temukan koleksi batik pilihan dari {SITE.nama_toko}.
                Menghadirkan motif khas Nusantara dengan kualitas terbaik
                untuk melengkapi berbagai kesempatan.
              </p>

              <div className="d-flex gap-3 flex-wrap">
                <Link
                  to="/toko"
                  className="btn px-4 py-3 fw-bold"
                  style={{
                    background: "#795548",
                    color: "#fff",
                    borderRadius: "30px",
                  }}
                >
                  Jelajahi Koleksi →
                </Link>

                <a
                  href="#tentang"
                  className="btn px-4 py-3 fw-bold"
                  style={{
                    border: "1px solid #fff",
                    color: "#fff",
                    borderRadius: "30px",
                  }}
                >
                  Tentang Kami
                </a>
              </div>
            </div>

            <div className="col-lg-4 d-none d-lg-block">
              <div
                style={{
                  borderLeft: "1px solid rgba(255,255,255,0.5)",
                  paddingLeft: "35px",
                }}
              >
                <p
                  className="mb-2 fw-bold text-white"
                  style={{
                    letterSpacing: "3px",
                    fontSize: "13px",
                  }}
                >
                  MOTIF · BUDAYA · GAYA
                </p>

                <p
                  className="mb-0 text-white"
                  style={{
                    lineHeight: "1.8",
                    opacity: 0.85,
                  }}
                >
                  Membawa keindahan batik Nusantara ke dalam gaya yang
                  sederhana, elegan, dan modern.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KATEGORI */}
      <section
        className="py-5"
        style={{ background: "#faf8f4" }}
      >
        <div className="container py-5">
          <div className="row align-items-end mb-5">
            <div className="col-lg-8">
              <p
                className="fw-bold mb-2"
                style={{
                  color: "#71816b",
                  letterSpacing: "3px",
                  fontSize: "13px",
                }}
              >
                PILIHAN KOLEKSI
              </p>

              <h2
                className="fw-bold mb-2"
                style={{
                  color: "#30251f",
                  fontSize: "42px",
                }}
              >
                Temukan Motif Favoritmu
              </h2>

              <p
                className="text-muted mb-0"
                style={{ fontSize: "16px" }}
              >
                Jelajahi berbagai pilihan batik khas Batik Singosaren.
              </p>
            </div>

            <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
              <Link
                to="/toko"
                className="text-decoration-none fw-bold"
                style={{ color: "#5d4037" }}
              >
                Lihat Semua Koleksi →
              </Link>
            </div>
          </div>

          <div className="row g-4">
            {kategoriList.length === 0 ? (
              <div className="col-12">
                <div className="text-center py-5">
                  <p className="text-muted mb-0">
                    Belum ada kategori.
                  </p>
                </div>
              </div>
            ) : (
              kategoriList.map((item, index) => {
                const namaKategori =
                  item.nama_kategori || item;

                return (
                  <div
                    className="col-md-4"
                    key={
                      item.id_kategori ||
                      namaKategori
                    }
                  >
                    <Link
                      to="/toko"
                      className="text-decoration-none"
                    >
                      <div
                        className="h-100 p-4"
                        style={{
                          minHeight: "270px",
                          background:
                            index % 3 === 1
                              ? "#68735b"
                              : "#5d4037",
                          color: "#fff",
                          borderRadius: "18px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          overflow: "hidden",
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <span
                            style={{
                              fontSize: "14px",
                              letterSpacing: "2px",
                            }}
                          >
                            {String(index + 1).padStart(
                              2,
                              "0"
                            )}
                          </span>

                          <span
                            style={{
                              width: "40px",
                              height: "40px",
                              border:
                                "1px solid rgba(255,255,255,0.6)",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "18px",
                            }}
                          >
                            →
                          </span>
                        </div>

                        <div>
                          <small
                            style={{
                              letterSpacing: "2px",
                              opacity: 0.8,
                            }}
                          >
                            KOLEKSI BATIK
                          </small>

                          <h3 className="fw-bold mt-2 mb-3">
                            {namaKategori}
                          </h3>

                          <p
                            className="mb-0"
                            style={{
                              lineHeight: "1.7",
                              opacity: 0.85,
                            }}
                          >
                            {deskripsi[namaKategori] ||
                              "Koleksi batik pilihan dari Batik Singosaren dengan karakter dan keindahan tersendiri."}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* PRODUK TERBARU */}
      <section
        className="py-5"
        style={{ background: "#eee7dc" }}
      >
        <div className="container py-4">
          <div className="d-flex justify-content-between align-items-end mb-5">
            <div>
              <p
                className="fw-bold mb-2"
                style={{
                  color: "#71816b",
                  letterSpacing: "2px",
                  fontSize: "13px",
                }}
              >
                PRODUK TERBARU
              </p>

              <h2
                className="fw-bold mb-0"
                style={{ color: "#30251f" }}
              >
                Koleksi Pilihan
              </h2>
            </div>

            <Link
              to="/toko"
              className="fw-bold text-decoration-none"
              style={{ color: "#5d4037" }}
            >
              Lihat Semua →
            </Link>
          </div>

          <div className="row g-4">
            {produkTerbaru.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">
                  Belum ada produk yang ditambahkan.
                </p>
              </div>
            ) : (
              produkTerbaru.slice(0, 6).map((p) => {
                const kategoriProduk =
                  kategoriList.find(
                    (item) =>
                      item.nama_kategori === p.kategori
                  );

                const namaKategoriProduk =
                  kategoriProduk?.nama_kategori ||
                  p.kategori;

                return (
                  <div
                    className="col-sm-6 col-lg-4"
                    key={p.id_produk}
                  >
                    <div
                      className="bg-white h-100"
                      style={{
                        borderRadius: "18px",
                        overflow: "hidden",
                        boxShadow:
                          "0 8px 25px rgba(60,45,35,0.08)",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                        }}
                      >
                        <img
                          src={mediaUrl(p.gambar)}
                          onError={onImgError}
                          alt={p.nama_produk}
                          className="w-100"
                          style={{
                            height: "280px",
                            objectFit: "cover",
                          }}
                        />

                        <span
                          className="position-absolute top-0 start-0 m-3 px-3 py-2 small fw-bold"
                          style={{
                            background: "#eee7dc",
                            color: "#5d4037",
                            borderRadius: "20px",
                          }}
                        >
                          {namaKategoriProduk}
                        </span>
                      </div>

                      <div className="p-4">
                        <h5
                          className="fw-bold mb-2"
                          style={{ color: "#30251f" }}
                        >
                          {p.nama_produk}
                        </h5>

                        <p
                          className="text-muted small mb-4"
                          style={{ minHeight: "45px" }}
                        >
                          {p.deskripsi}
                        </p>

                        <div className="d-flex justify-content-between align-items-center">
                          <strong
                            style={{ color: "#5d4037" }}
                          >
                            {formatRupiah(p.harga)}
                          </strong>

                          <Link
                            to={`/produk/${p.id_produk}`}
                            className="btn btn-sm text-white px-3"
                            style={{
                              background: "#5d4037",
                              borderRadius: "20px",
                            }}
                          >
                            Detail
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ARTIKEL */}
      <section
        className="py-5"
        style={{ background: "#faf8f4" }}
      >
        <div className="container py-4">
          <div className="row align-items-end mb-5">
            <div className="col-md-8">
              <p
                className="fw-bold mb-2"
                style={{
                  color: "#71816b",
                  letterSpacing: "2px",
                  fontSize: "13px",
                }}
              >
                CERITA BATIK
              </p>

              <h2
                className="fw-bold mb-2"
                style={{ color: "#30251f" }}
              >
                Mengenal Lebih Dekat Batik
              </h2>

              <p className="text-muted mb-0">
                Temukan informasi, cerita, dan wawasan seputar dunia
                batik.
              </p>
            </div>

            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <Link
                to="/artikel"
                className="fw-bold text-decoration-none"
                style={{ color: "#5d4037" }}
              >
                Semua Artikel →
              </Link>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div
                className="p-4 h-100"
                style={{
                  background: "#eee7dc",
                  borderRadius: "18px",
                }}
              >
                <small
                  className="fw-bold"
                  style={{ color: "#71816b" }}
                >
                  SEJARAH
                </small>

                <h4
                  className="fw-bold mt-3"
                  style={{ color: "#30251f" }}
                >
                  Mengenal Sejarah Batik Indonesia
                </h4>

                <p className="text-muted">
                  Mengenal perjalanan batik sebagai bagian dari budaya
                  Indonesia.
                </p>

                <Link
                  to="/artikel"
                  className="text-decoration-none fw-bold"
                  style={{ color: "#5d4037" }}
                >
                  Baca Artikel →
                </Link>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="p-4 h-100"
                style={{
                  background: "#dce2d8",
                  borderRadius: "18px",
                }}
              >
                <small
                  className="fw-bold"
                  style={{ color: "#71816b" }}
                >
                  MOTIF
                </small>

                <h4
                  className="fw-bold mt-3"
                  style={{ color: "#30251f" }}
                >
                  Mengenal Berbagai Motif Batik
                </h4>

                <p className="text-muted">
                  Setiap motif memiliki karakter dan cerita yang
                  berbeda.
                </p>

                <Link
                  to="/artikel"
                  className="text-decoration-none fw-bold"
                  style={{ color: "#5d4037" }}
                >
                  Baca Artikel →
                </Link>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="p-4 h-100"
                style={{
                  background: "#e4d8cc",
                  borderRadius: "18px",
                }}
              >
                <small
                  className="fw-bold"
                  style={{ color: "#71816b" }}
                >
                  PERAWATAN
                </small>

                <h4
                  className="fw-bold mt-3"
                  style={{ color: "#30251f" }}
                >
                  Tips Merawat Kain Batik
                </h4>

                <p className="text-muted">
                  Cara sederhana menjaga kualitas dan keindahan kain
                  batik.
                </p>

                <Link
                  to="/artikel"
                  className="text-decoration-none fw-bold"
                  style={{ color: "#5d4037" }}
                >
                  Baca Artikel →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TENTANG */}
      <section
        id="tentang"
        style={{ background: "#f5f1eb" }}
      >
        <div className="container py-5">
          <div className="row align-items-center g-5 py-lg-4">
            <div className="col-lg-5">
              <p
                className="fw-bold mb-2"
                style={{
                  color: "#71816b",
                  letterSpacing: "2px",
                  fontSize: "13px",
                }}
              >
                TENTANG KAMI
              </p>

              <h2
                className="fw-bold mb-4"
                style={{
                  color: "#30251f",
                  fontSize: "42px",
                  lineHeight: "1.2",
                }}
              >
                Mengenal{" "}
                <span style={{ color: "#795548" }}>
                  Batik Singosaren
                </span>
              </h2>

              <div
                style={{
                  width: "70px",
                  height: "3px",
                  background: "#71816b",
                  marginBottom: "25px",
                }}
              ></div>

              <p
                style={{
                  color: "#665b54",
                  lineHeight: "1.9",
                  fontSize: "16px",
                }}
              >
                Batik Singosaren hadir untuk memperkenalkan keindahan
                batik Nusantara melalui koleksi yang memiliki karakter,
                nilai budaya, dan kualitas yang baik.
              </p>
            </div>

            <div className="col-lg-7">
              <div
                className="p-4 p-lg-5"
                style={{
                  background: "#fff",
                  borderRadius: "20px",
                  boxShadow:
                    "0 10px 30px rgba(60,45,35,0.08)",
                }}
              >
                <p
                  style={{
                    color: "#665b54",
                    lineHeight: "1.9",
                    fontSize: "17px",
                  }}
                >
                  {SITE.tentang}
                </p>

                <div className="row g-3 mt-4">
                  <div className="col-sm-4">
                    <div
                      className="p-3"
                      style={{
                        background: "#eee7dc",
                        borderRadius: "12px",
                      }}
                    >
                      <h5
                        className="fw-bold mb-1"
                        style={{ color: "#5d4037" }}
                      >
                        01
                      </h5>
                      <small className="text-muted">
                        Motif Nusantara
                      </small>
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div
                      className="p-3"
                      style={{
                        background: "#dce2d8",
                        borderRadius: "12px",
                      }}
                    >
                      <h5
                        className="fw-bold mb-1"
                        style={{ color: "#5d4037" }}
                      >
                        02
                      </h5>
                      <small className="text-muted">
                        Kualitas Pilihan
                      </small>
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div
                      className="p-3"
                      style={{
                        background: "#e4d8cc",
                        borderRadius: "12px",
                      }}
                    >
                      <h5
                        className="fw-bold mb-1"
                        style={{ color: "#5d4037" }}
                      >
                        03
                      </h5>
                      <small className="text-muted">
                        Gaya Modern
                      </small>
                    </div>
                  </div>
                </div>

                <Link
                  to="/toko"
                  className="btn mt-4 px-4 py-3 text-white fw-bold"
                  style={{
                    background: "#5d4037",
                    borderRadius: "30px",
                  }}
                >
                  Jelajahi Koleksi →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
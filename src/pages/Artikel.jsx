import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { mediaUrl, onImgError, formatTanggal } from "../utils";

export default function Artikel() {
  const [artikel, setArtikel] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ambilArtikel = async () => {
      try {
        const response = await api.getArtikel();

        if (response.success && Array.isArray(response.data)) {
          setArtikel(response.data);
        } else {
          setArtikel([]);
        }
      } catch (error) {
        console.error("Gagal mengambil data artikel:", error);
        setArtikel([]);
      } finally {
        setLoading(false);
      }
    };

    ambilArtikel();
  }, []);

  return (
    <div style={{ background: "#faf8f4", minHeight: "100vh" }}>

      {/* HEADER ARTIKEL */}
      <section
        style={{
          background: "#f1ebe3",
          padding: "70px 0 55px",
          textAlign: "center",
        }}
      >
        <div className="container">
          <p
            style={{
              color: "#8a6a52",
              fontSize: "13px",
              letterSpacing: "3px",
              marginBottom: "10px",
            }}
          >
            BATIK SINGOSAREN
          </p>

          <h1
            style={{
              color: "#5d4037",
              fontWeight: "700",
              marginBottom: "15px",
            }}
          >
            Artikel & Cerita
          </h1>

          <p
            style={{
              color: "#75685f",
              maxWidth: "650px",
              margin: "0 auto",
            }}
          >
            Temukan informasi dan cerita seputar batik, budaya,
            motif, serta perjalanan Batik Singosaren.
          </p>
        </div>
      </section>


      {/* DAFTAR ARTIKEL */}
      <section style={{ padding: "60px 0" }}>
        <div className="container">

          {loading ? (
            <div className="text-center py-5">
              <p style={{ color: "#75685f" }}>
                Memuat artikel...
              </p>
            </div>
          ) : artikel.length === 0 ? (
            <div className="text-center py-5">
              <p style={{ color: "#75685f" }}>
                Belum ada artikel.
              </p>
            </div>
          ) : (
            <div className="row g-4">

              {artikel.map((item) => (
                <div className="col-md-4" key={item.id}>

                  <article
                    style={{
                      background: "#fff",
                      border: "1px solid #e8dfd5",
                      borderRadius: "12px",
                      overflow: "hidden",
                      height: "100%",
                    }}
                  >

                    {/* GAMBAR */}
                    {item.gambar ? (
                      <img
                        src={mediaUrl(item.gambar)}
                        onError={onImgError}
                        alt={item.judul}
                        style={{
                          width: "100%",
                          height: "220px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          height: "220px",
                          background: "#e8dfd5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#8a6a52",
                        }}
                      >
                        Tidak ada gambar
                      </div>
                    )}

                    {/* ISI CARD */}
                    <div style={{ padding: "24px" }}>

                      <small style={{ color: "#8a6a52" }}>
                        {formatTanggal(item.created_at)}
                      </small>

                      <h3
                        style={{
                          color: "#5d4037",
                          fontSize: "21px",
                          fontWeight: "700",
                          margin: "12px 0",
                        }}
                      >
                        {item.judul}
                      </h3>

                      <p
                        style={{
                          color: "#75685f",
                          lineHeight: "1.7",
                        }}
                      >
                        {item.ringkasan}
                      </p>

                      <Link
                        to={`/artikel/${item.id}`}
                        style={{
                          color: "#5d4037",
                          fontWeight: "600",
                          textDecoration: "none",
                        }}
                      >
                        Baca Selengkapnya →
                      </Link>

                    </div>
                  </article>

                </div>
              ))}

            </div>
          )}

        </div>
      </section>

    </div>
  );
}
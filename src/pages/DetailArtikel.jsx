import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import { mediaUrl, onImgError, formatTanggal } from "../utils";

export default function DetailArtikel() {
  const { id } = useParams();

  const [artikel, setArtikel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ambilArtikel = async () => {
      try {
        const response = await api.getArtikelById(id);

        if (response.success) {
          setArtikel(response.data);
        } else {
          setArtikel(null);
        }
      } catch (error) {
        console.error("Gagal mengambil detail artikel:", error);
        setArtikel(null);
      } finally {
        setLoading(false);
      }
    };

    ambilArtikel();
  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          background: "#faf8f4",
          minHeight: "100vh",
          padding: "100px 0",
        }}
      >
        <div className="container text-center">
          <p style={{ color: "#75685f" }}>
            Memuat artikel...
          </p>
        </div>
      </div>
    );
  }

  if (!artikel) {
    return (
      <div
        style={{
          background: "#faf8f4",
          minHeight: "100vh",
          padding: "100px 0",
        }}
      >
        <div className="container text-center">
          <h2 style={{ color: "#5d4037" }}>
            Artikel tidak ditemukan
          </h2>

          <Link
            to="/artikel"
            className="btn mt-3"
            style={{
              background: "#5d4037",
              color: "#fff",
            }}
          >
            Kembali ke Artikel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#faf8f4",
        minHeight: "100vh",
        padding: "60px 0",
      }}
    >
      <div className="container">

        {/* TOMBOL KEMBALI */}
        <div className="mb-4">
          <Link
            to="/artikel"
            style={{
              color: "#5d4037",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            ← Kembali ke Artikel
          </Link>
        </div>

        {/* ARTIKEL */}
        <article
          style={{
            background: "#fff",
            border: "1px solid #e8dfd5",
            borderRadius: "14px",
            overflow: "hidden",
          }}
        >

          {/* GAMBAR */}
          {artikel.gambar && (
            <img
              src={mediaUrl(artikel.gambar)}
              onError={onImgError}
              alt={artikel.judul}
              style={{
                width: "100%",
                maxHeight: "450px",
                objectFit: "cover",
              }}
            />
          )}

          {/* ISI */}
          <div
            style={{
              maxWidth: "850px",
              margin: "0 auto",
              padding: "45px 30px",
            }}
          >

            {/* TANGGAL */}
            <small style={{ color: "#8a6a52" }}>
              {formatTanggal(artikel.created_at)}
            </small>

            {/* JUDUL */}
            <h1
              style={{
                color: "#5d4037",
                fontWeight: "700",
                margin: "15px 0 25px",
                lineHeight: "1.3",
              }}
            >
              {artikel.judul}
            </h1>

            {/* RINGKASAN */}
            {artikel.ringkasan && (
              <p
                style={{
                  color: "#75685f",
                  fontSize: "18px",
                  lineHeight: "1.8",
                  marginBottom: "30px",
                  fontWeight: "500",
                }}
              >
                {artikel.ringkasan}
              </p>
            )}

            <hr style={{ borderColor: "#e8dfd5" }} />

            {/* ISI ARTIKEL */}
            <div
              style={{
                color: "#4f4640",
                fontSize: "16px",
                lineHeight: "1.9",
                marginTop: "30px",
                whiteSpace: "pre-line",
              }}
            >
              {artikel.isi}
            </div>

          </div>
        </article>

      </div>
    </div>
  );
}
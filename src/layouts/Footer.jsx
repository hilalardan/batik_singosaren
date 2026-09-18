import { SITE } from "../constants";

export default function Footer() {
return ( 

  <div className="container-fluid bg-dark text-white py-5"> 
   <div className="row">
      <div className="col-md-5 mb-4">
        <h4 className="fw-bold text-warning mb-3">{SITE.nama_toko}</h4>

        <p className="text-white-50 mb-3">
          Menyediakan berbagai pilihan batik khas Nusantara
          dengan motif indah dan kualitas terbaik.
        </p>
      </div>

      <div className="col-md-3 mb-4">
        <h5 className="fw-bold mb-3">
          Tentang Kami
        </h5>

        <p className="text-white-50 mb-2">
          {SITE.nama_toko} menyediakan berbagai pilihan
          batik dengan motif khas Nusantara yang elegan,
          berkualitas, dan cocok digunakan untuk berbagai
          acara.
        </p>

        <p className="text-white-50 mb-0">
          <i className="bi bi-clock me-2"></i>
          Buka dari jam 08:00 - 16:00
        </p>
      </div>

      <div className="col-md-4 mb-4">
        <h5 className="fw-bold mb-3">
          Ikuti Kami
        </h5>

        <p className="text-white-50 mb-3">
          Dapatkan informasi produk dan artikel terbaru
          dari {SITE.nama_toko}.
        </p>

        <div>
          <a
            href={SITE.link_ig}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline-light rounded-circle me-2"
            aria-label="Instagram"
          >
            <i className="bi bi-instagram"></i>
          </a>

          <a
            href={SITE.link_wa}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline-light rounded-circle me-2"
            aria-label="WhatsApp"
          >
            <i className="bi bi-whatsapp"></i>
          </a>

          <a
            href={SITE.link_fb}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline-light rounded-circle"
            aria-label="Facebook"
          >
            <i className="bi bi-facebook"></i>
          </a>
        </div>
      </div>
    </div>

    <hr className="border-secondary" />

    <div className="row">
      <div className="col-12 text-center">
        <p className="text-white-50 mb-0">
          © 2026 {SITE.nama_toko} · Semua Hak Dilindungi
        </p>
      </div>
    </div>
  </div>

);
}

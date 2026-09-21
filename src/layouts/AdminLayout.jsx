import { useEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";

import { adminApi } from "../api";
import { mediaUrl, onImgError } from "../utils";
import { SITE } from "../constants";

const MENU = [
  {
    to: "/admin",
    label: "Dashboard",
    icon: "bi-grid",
    end: true,
  },
  {
    to: "/admin/produk",
    label: "Produk",
    icon: "bi-box-seam",
  },
  {
    to: "/admin/kategori",
    label: "Kategori",
    icon: "bi-tags",
  },
  {
    to: "/admin/artikel",
    label: "Artikel",
    icon: "bi-newspaper",
  },
  {
    to: "/admin/pembeli",
    label: "Pembeli",
    icon: "bi-people",
  },
  {
    to: "/admin/pesanan",
    label: "Pesanan",
    icon: "bi-bag-check",
  },
  {
    to: "/admin/laporan",
    label: "Laporan Penjualan",
    icon: "bi-bar-chart-line",
  },
];

const TITLES = {
  "/admin": "Dashboard",
  "/admin/produk": "Kelola Produk",
  "/admin/kategori": "Kelola Kategori",
  "/admin/artikel": "Kelola Artikel",
  "/admin/pembeli": "Kelola Pembeli",
  "/admin/pesanan": "Kelola Pesanan",
  "/admin/laporan": "Laporan Penjualan",
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [adminName, setAdminName] = useState("");
  const [adminFoto, setAdminFoto] = useState("");

  const title =
    TITLES[location.pathname] || "Panel Admin";

  // Ambil profil admin
  useEffect(() => {
    adminApi
      .getMe()
      .then((res) => {
        if (!res.success) return;

        const p = res.data;

        const nama =
          `${p.nama_d || ""} ${p.nama_b || ""}`.trim();

        setAdminName(
          nama || p.uname || "Admin"
        );

        setAdminFoto(p.foto || "");
      })
      .catch((err) => {
        console.error(
          "Gagal mengambil profil admin:",
          err
        );
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("toko_token");
    navigate("/login");
  };

  return (
    <div className="adm-shell">

      {/* SIDEBAR */}
      <aside className="adm-sidebar">

        {/* Brand */}
        <div className="adm-sidebar-brand">

          <div className="adm-sidebar-brand-icon">
            <i className="bi bi-shop"></i>
          </div>

          <div>
            <div className="adm-sidebar-brand-title">
              {SITE.nama_toko || "Batik Singosaren"}
            </div>

            <div className="adm-sidebar-brand-sub">
              Admin Panel
            </div>
          </div>

        </div>

        {/* Menu */}
        <nav className="adm-nav">

          {MENU.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `adm-nav-item ${
                  isActive
                    ? "adm-nav-item--active"
                    : ""
                }`
              }
            >
              <i className={`bi ${item.icon}`}></i>

              <span>
                {item.label}
              </span>
            </NavLink>
          ))}

        </nav>

        {/* Footer Sidebar */}
        <div className="adm-sidebar-footer">

          <NavLink
            to="/"
            className="adm-link-muted"
          >
            <i className="bi bi-house"></i>
            Lihat website
          </NavLink>

          <button
            type="button"
            className="adm-link-logout"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i>
            Keluar
          </button>

        </div>

      </aside>

      {/* MAIN */}
      <div className="adm-main">

        {/* Topbar */}
        <header className="adm-topbar">

          <h1 className="adm-topbar-title">
            {title}
          </h1>

          <div className="adm-topbar-user">

            {/* Foto hanya ditampilkan jika tersedia */}
            {adminFoto && (
              <img
                src={mediaUrl(adminFoto)}
                onError={onImgError}
                alt="Foto Admin"
                className="adm-avatar"
              />
            )}

            <span className="adm-topbar-name">
              {adminName || "Admin"}
            </span>

          </div>

        </header>

        {/* Content */}
        <main className="adm-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

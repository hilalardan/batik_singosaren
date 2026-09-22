
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { SITE } from "../constants";
import Header from "../components/Header";
import Footer from "./Footer";

export default function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const isUserArea =
    location.pathname.startsWith("/user");

  function handleLogout() {
    localStorage.removeItem("toko_token");
    navigate("/login");
  }

  if (isUserArea) {
    return (
      <div className="user-area">

        {/* SIDEBAR */}
        <aside className="user-sidebar">

          {/* BRAND */}
          <div className="user-brand">
            <div>
              <h5>{SITE.nama_toko}</h5>

              <small>
                Halaman Pembeli
              </small>
            </div>
          </div>

          {/* MENU */}
          <nav className="user-menu">

            <NavLink
              to="/user"
              end
              className={({ isActive }) =>
                `user-menu-item ${
                  isActive ? "active" : ""
                }`
              }
            >
              <i className="bi bi-grid"></i>
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/user/toko"
              className={({ isActive }) =>
                `user-menu-item ${
                  isActive ? "active" : ""
                }`
              }
            >
              <i className="bi bi-shop"></i>
              <span>Belanja</span>
            </NavLink>

            <NavLink
              to="/user/cart"
              className={({ isActive }) =>
                `user-menu-item ${
                  isActive ? "active" : ""
                }`
              }
            >
              <i className="bi bi-cart3"></i>
              <span>Keranjang</span>
            </NavLink>

            <NavLink
              to="/user/pesanan"
              className={({ isActive }) =>
                `user-menu-item ${
                  isActive ? "active" : ""
                }`
              }
            >
              <i className="bi bi-bag-check"></i>
              <span>Pesanan Saya</span>
            </NavLink>

          </nav>

          {/* SIDEBAR BOTTOM */}
          <div className="user-sidebar-bottom">

            <NavLink
              to="/"
              className="user-menu-item"
            >
              <i className="bi bi-house"></i>
              <span>Kembali ke Website</span>
            </NavLink>

            <button
              type="button"
              className="user-menu-item user-logout"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right"></i>
              <span>Keluar</span>
            </button>

          </div>
        </aside>

        {/* KONTEN PEMBELI */}
        <div className="user-main">

          {/* TOPBAR */}
          <div className="user-topbar">

            <div>
              <h4 className="mb-1">
                Halaman Pembeli
              </h4>

              <small className="text-muted">
                Kelola belanja dan pesanan kamu
              </small>
            </div>

            <div className="user-topbar-icon">
              <i className="bi bi-person-circle"></i>
            </div>

          </div>

          {/* CONTENT */}
          <main className="user-content">
            <Outlet />
          </main>

        </div>

      </div>
    );
  }

  // LOGIN & REGISTER
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  if (isAuthPage) {
    return (
      <>
        <Header />
        <Outlet />
      </>
    );
  }

  // WEBSITE UTAMA
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

import { Link, NavLink } from "react-router-dom";
import { onImgError } from "../utils";
import { SITE, PUBLIC_NAV } from "../constants";

export default function Header() {
  return (
    <nav
      className="navbar navbar-expand-lg"
      style={{
        background: "#fff",
        minHeight: "72px",
        borderBottom: "1px solid #e4e9e5",
      }}
    >
      <div className="container">

        {/* LOGO */}
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center"
        >
          {SITE.logo_toko && (
            <img
              src={SITE.logo_toko}
              onError={onImgError}
              alt={SITE.nama_toko}
              style={{
                height: "60px",
                width: "auto",
                objectFit: "contain",
              }}
            />
          )}
        </Link>

        {/* MENU MOBILE */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          style={{
            border: "none",
            boxShadow: "none",
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* NAVBAR */}
        <div
          className="collapse navbar-collapse"
          id="navbarNav"
        >

          {/* MENU UTAMA */}
          <ul className="navbar-nav mx-auto align-items-lg-center gap-lg-2">
            {PUBLIC_NAV.map((item) => (
              <li
                className="nav-item"
                key={item.to}
              >
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `nav-link px-3 ${
                      isActive ? "fw-bold" : ""
                    }`
                  }
                  style={({ isActive }) => ({
                    color: isActive ? "#657a68" : "#536158",
                    fontSize: "15px",
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    borderBottom: isActive
                      ? "2px solid #657a68"
                      : "2px solid transparent",
                  })}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* MENU KANAN */}
          <div
            className="d-flex align-items-center gap-2 mt-3 mt-lg-0"
          >

            {/* KERANJANG */}
            <Link
              to="/cart"
              title="Keranjang"
              className="btn d-flex align-items-center justify-content-center"
              style={{
                color: "#536158",
                width: "42px",
                height: "42px",
                border: "1px solid #cbd5ce",
                borderRadius: "50%",
                fontSize: "19px",
              }}
            >
              <i className="bi bi-bag"></i>
            </Link>

            {/* LOGIN */}
            <Link
              to="/login"
              title="Login"
              className="btn d-flex align-items-center justify-content-center"
              style={{
                color: "#536158",
                width: "42px",
                height: "42px",
                border: "1px solid #cbd5ce",
                borderRadius: "50%",
                fontSize: "19px",
              }}
            >
              <i className="bi bi-person"></i>
            </Link>

            {/* REGISTER */}
            <Link
              to="/register"
              title="Register"
              className="btn d-flex align-items-center justify-content-center"
              style={{
                background: "#657a68",
                color: "#fff",
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                fontSize: "18px",
              }}
            >
              <i className="bi bi-person-plus"></i>
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
}

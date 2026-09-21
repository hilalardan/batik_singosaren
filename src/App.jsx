import { BrowserRouter, Route, Routes } from "react-router-dom";

import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/Home";
import Toko from "./pages/Toko";
import Artikel from "./pages/Artikel";
import DetailArtikel from "./pages/DetailArtikel";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DetailProduk from "./pages/DetailProduk";
import Cart from "./pages/Cart";
import Pesanan from "./pages/Pesanan";
import UserDashboard from "./pages/UserDashboard";

import AdminProduk from "./pages/admin/AdminProduk";
import AdminOverviewPage from "./pages/admin/AdminOverviewPage";
import AdminPembelian from "./pages/admin/AdminPembelian";
import AdminPembeli from "./pages/admin/AdminPembeli";
import AdminArtikel from "./pages/admin/AdminArtikel";
import AdminKategori from "./pages/admin/AdminKategori";
import AdminLaporan from "./pages/admin/AdminLaporan";
import AdminPesanan from "./pages/admin/AdminPesanan";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* WEBSITE / USER */}
        <Route element={<UserLayout />}>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/toko"
            element={<Toko />}
          />

          <Route
            path="/artikel"
            element={<Artikel />}
          />

          <Route
            path="/artikel/:id"
            element={<DetailArtikel />}
          />

          <Route
            path="/produk/:id"
            element={<DetailProduk />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* USER DASHBOARD */}
          <Route
            path="/user"
            element={<UserDashboard />}
          />

          <Route
            path="/user/toko"
            element={<Toko />}
          />

          <Route
            path="/user/cart"
            element={<Cart />}
          />

          <Route
            path="/user/pesanan"
            element={<Pesanan />}
          />

        </Route>

        {/* ADMIN */}
        <Route
          path="/admin"
          element={<AdminLayout />}
        >

          <Route
            index
            element={<AdminOverviewPage />}
          />

          <Route
            path="produk"
            element={<AdminProduk />}
          />

          <Route
            path="artikel"
            element={<AdminArtikel />}
          />

          <Route
            path="pembeli"
            element={<AdminPembeli />}
          />

          {/* KELOLA PESANAN */}
          <Route
            path="pesanan"
            element={<AdminPesanan />}
          />

          <Route
            path="kategori"
            element={<AdminKategori />}
          />

          {/* LAPORAN PENJUALAN */}
          <Route
            path="laporan"
            element={<AdminLaporan />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;

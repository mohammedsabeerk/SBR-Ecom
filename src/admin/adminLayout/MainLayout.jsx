import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import DashBoard from "../pages/DashBoard";
import AccountAd from "../pages/AccountAd";
import Orders from "../pages/OrdersAd";
import Product from "../pages/ProductAd";
import UserAd from "../pages/UserAd";

import Sidebar from "../component/Sidebar";
import Navbar from "../component/NavBar";
import { AppContext } from "../../context/AppContext";

function MainLayout() {
  const { currentUser } = useContext(AppContext);

  if (!currentUser || currentUser.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#cfd4d6] text-white">
      <Sidebar />

      <div
        className="
          flex-1
          ml-16
          peer-hover:ml-64
          transition-all duration-300 ease-in-out
        "
      >
        <Navbar />

        <div className="p-6">
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<DashBoard />} />
            <Route path="accountad" element={<AccountAd />} />
            <Route path="orders" element={<Orders />} />
            <Route path="product" element={<Product />} />
            <Route path="user" element={<UserAd />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;

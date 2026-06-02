import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import DashBoard from "../../pages/admin/DashBoard";
import AccountAd from "../../pages/admin/AccountAd";
import Orders from "../../pages/admin/OrdersAd";
import Product from "../../pages/admin/ProductAd";
import UserAd from "../../pages/admin/UserAd";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useAppContext } from "../../context/AppContext";
import AdminRoute from "../../routes/AdminRoutes";

function MainLayout() {
  const { currentUser } = useAppContext();

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
            <Route path="dashboard" element={<AdminRoute><DashBoard /></AdminRoute>} />
            <Route path="accountad" element={<AdminRoute><AccountAd /></AdminRoute>} />
            <Route path="orders" element={<AdminRoute><Orders /></AdminRoute>} />
            <Route path="product" element={<AdminRoute><Product /></AdminRoute>} />
            <Route path="user" element={<AdminRoute><UserAd /></AdminRoute>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;

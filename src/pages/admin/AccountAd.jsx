import React from "react";
import { FaSignOutAlt, FaArrowLeft } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

function AccountAd() {
  const navigate = useNavigate();

  const admin = {
    name: "Mohammed Sabeer",
    email: "admin@gmail.com",
    image: "Adminpic.jpg",
  };

  return (
    <div className="flex justify-center items-start mt-10">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-sm text-center relative">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="absolute left-4 top-4 flex items-center gap-2 text-sm text-gray-600 hover:text-black"
        >
          <FaArrowLeft /> Back
        </button>

        <img
          src={`/${admin.image}`}
          alt="Admin"
          className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-gray-300 mb-4 mt-6"
        />

        <h2 className="text-2xl font-bold mb-1">{admin.name}</h2>
        <p className="text-gray-500 mb-5">{admin.email}</p>
      </div>
    </div>
  );
}

export default AccountAd;

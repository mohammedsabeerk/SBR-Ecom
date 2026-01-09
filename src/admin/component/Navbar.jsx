import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/E-logo7.png";

function Navbar() {
  const navigate = useNavigate();

  const admin = {
    imageFileName: "Adminpic.jpg",
  };

  return (
    <nav
      className="
        fixed top-0 left-0 w-full h-15
        flex items-center justify-between px-6
        backdrop-blur-md bg-white/10
        border-b border-white/20
        shadow-sm z-50
      "
    >
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="Admin Logo"
          className="h-20 w-auto object-contain"
        />
      </div>

      <img
        src={`/${admin.imageFileName}`}
        alt="Admin"
        onClick={() => navigate("/admin/accountad")}
        className="
          w-10 h-10 rounded-full cursor-pointer
          border border-white/40
          hover:scale-105 transition
        "
      />
    </nav>
  );
}

export default Navbar;

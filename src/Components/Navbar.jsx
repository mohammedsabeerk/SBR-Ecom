import React from "react";
import logo from "../assets/E-logo6.png";
import { FaHeart, FaShoppingCart, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";



import { toast } from "react-toastify";

function Navbar() {
  const navigate = useNavigate();
  const { wishlist, cart } = useAppContext();
const { currentUser } = useAppContext();

 const goToAccount = () => {
  if (!currentUser) {
    toast.info("Please login first");
    navigate("/login");
  } else {
    navigate("/account");
  }
};


  return (
    <nav className="
  fixed top-4 left-1/2 -translate-x-1/2
  z-50
  w-[95%] max-w-7xl
  h-16
  flex items-center justify-between
  px-6
  rounded-2xl
  bg-white/40 backdrop-blur-xl
  shadow-lg
  border border-white/30
">
    
      <img
        src={logo}
        alt="Brand Logo"
        className="h-20 w-18 cursor-pointer"
        onClick={() => navigate("/")}
      />

      <div className="flex items-center gap-8">
        <span onClick={() => navigate("/")} className="cursor-pointer text-sm font-medium hover:text-blue-600">
          Home
        </span>
        <span onClick={() => navigate("/about")} className="cursor-pointer text-sm font-medium hover:text-blue-600">
          About
        </span>

     
        <div className="relative cursor-pointer" onClick={() => navigate("/wishlist")}>
          <FaHeart className="text-xl" />
          {wishlist.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </div>

     
        <div className="relative cursor-pointer" onClick={() => navigate("/cart")}>
          <FaShoppingCart className="text-xl" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </div>

        
        <FaUser
          className="text-xl cursor-pointer hover:text-blue-600"
          onClick={goToAccount}
        />
        
      </div>
    </nav>
    
  );
}

export default Navbar;


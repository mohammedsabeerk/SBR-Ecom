import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Orders from "./pages/Orders";
import Wishlist from "./pages/WishList";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import ProductsSection from "./pages/ProductsSection";
import Account from "./pages/Account";
import ProductDetails from "./pages/ProductDetails";
import FeaturedProduct from "./pages/FeaturedProduct";
import About from "./pages/About";

import MainLayout from "./admin/adminLayout/MainLayout";

function App() {
  const location = useLocation();


  const hideLayout =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register") ||
    location.pathname.startsWith("/admin");

  return (
    <div>
      {!hideLayout && <Navbar />}

      <Routes>
   
        <Route path="/admin/*" element={<MainLayout />} />

      
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/about" element={<About />} />
        <Route path="/featuredproducts" element={<FeaturedProduct />} />
        <Route path="/products" element={<ProductsSection />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/account" element={<Account />} />
      </Routes>

      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;

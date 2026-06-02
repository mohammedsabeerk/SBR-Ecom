import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/user/Navbar";
import Footer from "./components/user/Footer";
import Home from "./pages/user/Home";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import Orders from "./pages/user/Orders";
import Wishlist from "./pages/user/WishList";
import Cart from "./pages/user/Cart";
import Payment from "./pages/user/Payment";
import ProductsSection from "./pages/user/ProductsSection";
import Account from "./pages/user/Account";
import ProductDetails from "./pages/user/ProductDetails";
import FeaturedProduct from "./pages/user/FeaturedProduct";
import About from "./pages/user/About";
import Checkout from "./pages/user/Checkout";
import Success from "./pages/user/Success";
import Cancel from "./pages/user/Cancel";

import MainLayout from "./components/admin/MainLayout";

import ProtectedRoute from "./pages/user/ProtectedRoute";
import AdminRoute from "./routes/AdminRoutes";


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
   
        <Route path="/admin/*" element={<AdminRoute><MainLayout /></AdminRoute>} />

      
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/about" element={<About />} />
        <Route path="/featuredproducts" element={<FeaturedProduct />} />
        <Route path="/products" element={<ProductsSection />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
        <Route path="/cancel" element={<ProtectedRoute><Cancel /></ProtectedRoute>} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
      </Routes>

      {!hideLayout && <Footer />}
    </div>
  );
}

export default App;

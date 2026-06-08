import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  getCart,
  addToCart as apiAddToCart,
  removeFromCart as apiRemoveFromCart,
  updateCartQuantity as apiUpdateCartQuantity,
  updateCartSize as apiUpdateCartSize,
  clearCart as apiClearCart,
} from "../api/cartApi";

const CartContext = createContext();

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export const CartProvider = ({ children }) => {
  const { currentUser, authLoading } = useAuth();
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const fetchCart = useCallback(async () => {
   
    if (!currentUser || currentUser.role !== "user") { setCart([]); return; }
    try {
      const data = await getCart();
      setCart(data || []);
    } catch { setCart([]); }
  }, [currentUser]);

  useEffect(() => {
    fetchCart();
  }, [currentUser, fetchCart]);

 
  const addToCart = useCallback(async (item) => {
    if (authLoading) return false;
    if (!currentUser) {
      toast.info("Please login to add items to cart");
      navigate("/login");
      return false;
    }
    try {
      const data = await apiAddToCart({
        productId: item._id || item.id,
        name: item.name,
        img: item.img,
        price: item.price,
        size: item.size || "",
        quantity: item.quantity || 1,
      });
      setCart(data);
      return true;
    } catch {
      return false;
    }
  }, [authLoading, currentUser, navigate]);

  const removeFromCart = useCallback(async (productId, size) => {
    try {
      const data = await apiRemoveFromCart(productId, size);
      setCart(data);
    } catch { /* ignore */ }
  }, []);

  const updateCartQuantity = useCallback(async (productId, size, quantity) => {
    try {
      const data = await apiUpdateCartQuantity(productId, size, quantity);
      setCart(data);
    } catch { /* ignore */ }
  }, []);

  const updateCartSize = useCallback(async (productId, oldSize, newSize) => {
    try {
      const data = await apiUpdateCartSize(productId, oldSize, newSize);
      setCart(data);
    } catch { /* ignore */ }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      await apiClearCart();
      setCart([]);
    } catch { /* ignore */ }
  }, []);

  return (
    <CartContext.Provider value={{
      cart, setCart, fetchCart,
      addToCart, removeFromCart,
      updateCartQuantity, updateCartSize, clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
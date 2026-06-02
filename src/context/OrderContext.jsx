import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";
import {
  getOrders,
  placeOrder as apiPlaceOrder,
  cancelOrder as apiCancelOrder,
  deleteOrder as apiDeleteOrder,
} from "../api/orderApi";

const OrderContext = createContext();

export const useOrder = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within OrderProvider");
  return ctx;
};

export const OrderProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const { clearCart } = useCart();
  const [orders, setOrders] = useState([]);

  const fetchOrders = useCallback(async () => {
    // Only fetch user orders for regular users, not admins
    if (!currentUser || currentUser.role !== "user") { setOrders([]); return; }
    try {
      const data = await getOrders();
      setOrders(data || []);
    } catch { setOrders([]); }
  }, [currentUser]);


  useEffect(() => {
    fetchOrders();
  }, [currentUser, fetchOrders]);

  const placeOrder = useCallback(async ({ items, method, details, isBuyNow }) => {
    if (!currentUser) return false;
    try {
      const newOrder = await apiPlaceOrder({
        products: items.map((item) => ({
          product: item.productId || item._id || item.product,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
          title: item.name || item.title,
          image: item.img || item.image,
        })),
        totalPrice: items.reduce((t, i) => t + i.price * i.quantity, 0),
        totalItems: items.reduce((t, i) => t + i.quantity, 0),
        paymentMethod: method,
        shippingAddress: method === "COD" ? {
          fullName: details.name || "",
          phone: details.phone || "",
          address: details.address || "",
          city: details.city || "",
          state: details.state || "",
          pincode: details.pincode || "",
          country: details.country || "India",
        } : {
          fullName: currentUser.username || "",
          phone: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          country: "India",
        },
      });
      setOrders((prev) => [...prev, newOrder]);
      if (!isBuyNow) await clearCart();
      return true;
    } catch { return false; }
  }, [currentUser, clearCart]);

  const cancelOrder = useCallback(async (orderId) => {
    try {
      const updated = await apiCancelOrder(orderId);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
    } catch { /* ignore */ }
  }, []);

  const deleteCancelledOrder = useCallback(async (orderId) => {
    try {
      await apiDeleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch { /* ignore */ }
  }, []);

  return (
    <OrderContext.Provider value={{ orders, setOrders, fetchOrders, placeOrder, cancelOrder, deleteCancelledOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderProvider;

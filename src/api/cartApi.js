import api from "./axios";

export const getCart = async () => {
  const res = await api.get("/cart");
  return res.data;
};

export const addToCart = async (cartData) => {
  const res = await api.post("/cart", cartData);
  return res.data;
};

export const updateCartQuantity = async (productId, size, quantity) => {
  const res = await api.put("/cart/quantity", { productId, size, quantity });
  return res.data;
};

export const updateCartSize = async (productId, oldSize, newSize) => {
  const res = await api.put("/cart/size", { productId, oldSize, newSize });
  return res.data;
};

export const removeFromCart = async (productId, size) => {
  const res = await api.delete("/cart/remove", { data: { productId, size } });
  return res.data;
};

export const clearCart = async () => {
  const res = await api.delete("/cart/clear");
  return res.data;
};

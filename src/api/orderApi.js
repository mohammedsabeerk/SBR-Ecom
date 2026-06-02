import api from "./axios";

export const getOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};

export const placeOrder = async (orderData) => {
  const res = await api.post("/orders", orderData);
  return res.data;
};

export const cancelOrder = async (orderId) => {
  const res = await api.put(`/orders/${orderId}/cancel`);
  return res.data;
};

export const deleteOrder = async (orderId) => {
  const res = await api.delete(`/orders/${orderId}`);
  return res.data;
};

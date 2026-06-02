import api from "./axios";


export const getDashboardStats = async () => {
  const res = await api.get("/admin/dashboard/stats");
  return res.data;
};

export const getMonthlyRevenue = async () => {
  const res = await api.get("/admin/dashboard/revenue/monthly");
  return res.data;
};

export const getWeeklyRevenue = async () => {
  const res = await api.get("/admin/dashboard/revenue/weekly");
  return res.data;
};


export const getAllOrders = async () => {
  const res = await api.get("/admin/orders");
  return res.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const res = await api.put(`/admin/orders/${orderId}/status`, { status });
  return res.data;
};


export const getAllUsers = async () => {
  const res = await api.get("/admin/users");
  return res.data;
};

export const toggleBlockUser = async (userId) => {
  const res = await api.put(`/admin/users/${userId}/block`);
  return res.data;
};


export const adminAddProduct = async (formData) => {
  const res = await api.post("/admin/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const adminUpdateProduct = async (id, formData) => {
  const res = await api.put(`/admin/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const adminDeleteProduct = async (id) => {
  const res = await api.delete(`/admin/products/${id}`);
  return res.data;
};

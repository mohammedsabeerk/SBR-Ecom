import api from "./axios";

export const getProducts = async () => {
  const res = await api.get("/api/products");
  return res.data;
};

export const getProductById = async (id) => {
  const res = await api.get(`/api/products/${id}`);
  return res.data;
};

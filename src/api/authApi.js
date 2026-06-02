import api from "./axios";

export const loginUser = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data;
};

export const registerUser = async (username, email, password) => {
  const res = await api.post("/auth/register", { username, email, password });
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const changePassword = async (oldPassword, newPassword) => {
  const res = await api.put("/auth/change-password", { oldPassword, newPassword });
  return res.data;
};

import axios from "axios";
 
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
});
 
// REQUEST LOGGER (only in development)
api.interceptors.request.use((config) => {
  if (import.meta.env.DEV) {
    console.log(`${config.method?.toUpperCase()} REQUEST -> ${config.url}`);
    console.log("REQUEST BODY:", config.data);
  }
  return config;
});
 
// RESPONSE LOGGER + 401 HANDLER
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`RESPONSE ${response.status} <- ${response.config.url}`);
      console.log("RESPONSE DATA:", response.data);
    }
    return response;
  },
 
  async (error) => {
    const originalRequest = error.config;
    if (import.meta.env.DEV) {
      console.log(`API ERROR ${error.response?.status} <- ${originalRequest?.url}`);
      console.log("ERROR DATA:", error.response?.data);
    }
 
    //  On 401 — try the /auth/refresh endpoint once
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh") &&
      !originalRequest.url.includes("/auth/login") &&
      !originalRequest.url.includes("/auth/me")
    ) {
      originalRequest._retry = true;
 
      try {
        if (import.meta.env.DEV) console.log("TRYING REFRESH TOKEN");
        await api.post("/auth/refresh");
        if (import.meta.env.DEV) console.log("TOKEN REFRESHED");
        return api(originalRequest); // retry original request
      } catch (refreshError) {
        if (import.meta.env.DEV) console.log("REFRESH FAILED → redirecting to login");
        if (window.location.pathname !== "/login") {
          window.location.replace("/login");
        }
        return Promise.reject(refreshError);
      }
    }
 
    return Promise.reject(error);
  }
);
 
export default api;
 
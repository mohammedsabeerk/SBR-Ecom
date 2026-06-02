import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser, registerUser, logoutUser,  changePassword } from "../api/authApi";
import api from "../api/axios";

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);


  useEffect(() => {
    const loadUser = async () => {
      try {
        // Call the custom /auth/me endpoint (handles both user and admin auth)
        const res = await api.get("/auth/me");
        
        // If user data is returned, set it (works for both regular user and admin)
        if (res.data && res.data._id) {
          setCurrentUser(res.data);
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        // 401 or any error = guest user or session expired, set to null
        if (import.meta.env.DEV) console.log("Guest user or session expired");
        setCurrentUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    loadUser();
  }, []);

 
  const login = useCallback(async (email, password) => {
    try {
      const data = await loginUser(email, password);
      setCurrentUser(data.user);
      return data.user.role || "user";
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
      return false;
    }
  }, []);

 
  const register = useCallback(async (username, email, password) => {
    try {
      await registerUser(username, email, password);
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
      return false;
    }
  }, []);


  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch { /* ignore */ }
    setCurrentUser(null);
    navigate("/login");
  }, [navigate]);

 
  const updatePassword = useCallback(async (oldPassword, newPassword) => {
    try {
      const data = await changePassword(oldPassword, newPassword);
      toast.success(data.message);
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update password");
      return false;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, authLoading, login, register, logout, updatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
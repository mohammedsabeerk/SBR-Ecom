import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const { currentUser, authLoading } = useAuth();

  // Show toast when trying to access protected route without login
  useEffect(() => {
    if (!authLoading && !currentUser) {
      toast.info("Please login to continue");
    }
  }, [authLoading, currentUser]);

  // IMPORTANT
  if (authLoading) {
    return <div>Loading...</div>;
  }

  // Only redirect AFTER loading finished
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
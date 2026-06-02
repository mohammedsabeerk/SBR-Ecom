import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { currentUser, authLoading } = useAuth();

  //  CRITICAL: wait for getMe() to finish before deciding
  // Without this, every refresh sees currentUser=null briefly → redirects to login
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#cfd4d6]">
        <div className="w-8 h-8 border-4 border-[#2f2926] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== "admin") return <Navigate to="/" replace />;

  return children;
}

export default AdminRoute;

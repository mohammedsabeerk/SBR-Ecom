import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

function Account() {
  const { currentUser, logout, updatePassword, authLoading } = useAppContext();
  const navigate = useNavigate();

  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  //   useEffect(() => {

  //   if (!currentUser) {

  

  //   }

  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentUser]);

  useEffect(() => {
    if (authLoading) return;

    // ✅ FIXED: redirect non-logged-in users to login
    if (!currentUser) {
      toast.info("Please login to view your account");
      navigate("/login", { replace: true });
      return;
    }

    // redirect admin users to login (they should use admin dashboard)
    if (currentUser?.role === "admin") {
      navigate("/login", { replace: true });
    }
  }, [currentUser, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Loading account...</p>
      </div>
    );
  }

  if (!currentUser || currentUser.role === "admin") return null;

  const handlePasswordChange = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    const success = await updatePassword(oldPassword, newPassword);

    if (!success) return;

    toast.success("Password updated successfully");

    setOldPassword("");
    setNewPassword("");
    setShowPasswordBox(false);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Please login or register first</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold">
            {/* {currentUser.username.charAt(0).toUpperCase()} */}
            {currentUser?.username?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">My Account</h2>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-gray-700">
            <span className="font-semibold">Name</span>
            <span>{currentUser.username}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span className="font-semibold">Email</span>
            <span>{currentUser.email}</span>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          {!showPasswordBox ? (
            <button
              onClick={() => setShowPasswordBox(true)}
              className="w-full py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
            >
              Change Password
            </button>
          ) : (
            <>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />

              <input
                type="password"
                id="newPassword"
                name="newPassword"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              <button
                onClick={handlePasswordChange}
                className="w-full py-2 rounded-lg bg-black text-white hover:bg-gray-800 transition"
              >
                Update Password
              </button>
            </>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/orders")}
            className="w-full py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            View Orders
          </button>

          <button
            onClick={logout}
            className="w-full py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Account;

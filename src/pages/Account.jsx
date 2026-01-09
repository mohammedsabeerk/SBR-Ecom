import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";

function Account() {
  const { currentUser, logout, updatePassword } = useAppContext();
  const navigate = useNavigate();

  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (!currentUser) {
      navigate("/login", { replace: true });
    }
  }, [currentUser, navigate]);

  const handlePasswordChange = async () => {
    if (oldPassword !== currentUser.password) {
      toast.error("Old password is incorrect");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    await updatePassword(newPassword);
    toast.success("Password updated successfully");

    setOldPassword("");
    setNewPassword("");
    setShowPasswordBox(false);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">
          Please login or register first
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">

        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6">My Account</h2>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-gray-700">
            <span className="font-semibold">Name</span>
            <span>{currentUser.name}</span>
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
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
              <input
                type="password"
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

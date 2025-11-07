import React, { useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/axiosInstance";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

const ManagerSettingsPage = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  // --- Backend Assumption: A route for updating user data, including password ---
  // NOTE: This assumes you have implemented a PUT /api/auth/updatePassword endpoint
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setStatus({ message: "", type: "" });
    setLoading(true);

    if (newPassword !== confirmNewPassword) {
      setStatus({ message: "New passwords do not match.", type: "error" });
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      // Basic validation
      setStatus({
        message: "New password must be at least 6 characters long.",
        type: "error",
      });
      setLoading(false);
      return;
    }

    try {
      // Placeholder API call assuming you create this endpoint later:
      // PUT /api/users/password (Protected route)
      await api.put(`/users/password`, {
        userId: user.id, // Or _id, depending on backend model
        currentPassword,
        newPassword,
      });

      setStatus({ message: "Password updated successfully!", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      console.error("Password update failed:", err);
      setStatus({
        message:
          err.response?.data?.message ||
          "Failed to update password. Check current password.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto ml-64">
        <Navbar />
        <main className="p-8 pt-20">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
              Manager Settings
            </h1>

            {/* Status Message */}
            {status.message && (
              <div
                className={`p-4 mb-4 rounded-lg text-center ${
                  status.type === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {status.message}
              </div>
            )}

            {/* --- Password Update Card --- */}
            <div className="max-w-xl bg-white p-8 rounded-xl shadow-2xl space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">
                Update Account Password
              </h2>

              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <p className="text-sm text-gray-600">
                  You are changing the password for: <b>{user?.email}</b>
                </p>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 text-lg font-medium rounded-lg text-white transition duration-150 ${
                    loading
                      ? "bg-indigo-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {loading ? "Updating..." : "Change Password"}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ManagerSettingsPage;

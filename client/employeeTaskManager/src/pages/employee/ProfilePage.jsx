import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import EmployeeSidebar from "../../components/layout/EmployeeSidebar";
import EmployeeNavbar from "../../components/layout/EmployeeNavbar";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      <EmployeeSidebar />
      <div className="flex-1 overflow-auto ml-64">
        <EmployeeNavbar />
        <main className="p-8 pt-20">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
              My Profile
            </h1>

            <div className="max-w-md bg-white p-8 rounded-xl shadow-2xl space-y-4">
              <h2 className="text-xl font-semibold text-indigo-700 border-b pb-2">
                Account Details
              </h2>

              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="text-lg font-bold text-gray-800">{user?.name}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Email Address
                </p>
                <p className="text-lg font-bold text-gray-800">{user?.email}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Role</p>
                <p className="text-lg font-bold text-green-600">{user?.role}</p>
              </div>

              <p className="pt-4 text-sm text-gray-500">
                Contact your manager to update these details.
              </p>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;

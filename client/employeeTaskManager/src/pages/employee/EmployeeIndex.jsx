import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import EmployeeSidebar from "../../components/layout/EmployeeSidebar";
import EmployeeNavbar from "../../components/layout/EmployeeNavbar";

const EmployeeIndex = () => {
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
              Welcome Back, {user?.name}!
            </h1>
            <p className="text-gray-600 mb-4">
              Use the sidebar to navigate your tasks and manage your profile.
            </p>

            {/* Placeholder for quick stats or recent tasks */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold text-indigo-700">
                Quick Access
              </h2>
              <p className="mt-2 text-gray-500">
                Navigate to My Tasks in the sidebar to view your assignments and
                update your statuses.
              </p>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default EmployeeIndex;

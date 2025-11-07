import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "framer-motion";

const EmployeeNavbar = () => {
  const { user, logout } = useAuth();

  return (
    <motion.header
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
      className="fixed top-0 left-64 right-0 h-16 bg-white shadow-md z-10 p-4 flex items-center justify-end"
    >
      <div className="flex items-center space-x-4">
        <span className="text-gray-600 text-sm font-semibold">
          Welcome, {user?.name}
        </span>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-3 rounded-lg transition duration-200"
        >
          Logout
        </button>
      </div>
    </motion.header>
  );
};

export default EmployeeNavbar;

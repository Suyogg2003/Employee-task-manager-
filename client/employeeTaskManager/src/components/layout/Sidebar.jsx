import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { name: "Dashboard", path: "/manager" },
  { name: "Employees", path: "/manager/employees" },
  { name: "Tasks", path: "/manager/tasks" },
  { name: "Reports", path: "/manager/reports" },
  { name: "Settings", path: "/manager/settings" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white shadow-2xl z-20 p-4"
    >
      <div className="text-2xl font-bold mb-8 text-indigo-400">
        Task Manager
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center p-3 rounded-lg transition duration-150 ${
              location.pathname === item.path
                ? "bg-indigo-600 font-semibold"
                : "hover:bg-gray-700"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </motion.div>
  );
};

export default Sidebar;

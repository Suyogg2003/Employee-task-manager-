import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/axiosInstance";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

const ManagerIndex = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [employeesCount, setEmployeesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tasksResponse, employeesResponse] = await Promise.all([
          api.get("/tasks"),
          api.get("/users/employees"),
        ]);

        setTasks(tasksResponse.data);
        setEmployeesCount(employeesResponse.data.length);
      } catch (err) {
        console.error("Manager Index Data Fetch Error:", err);
        // Handle error state appropriately
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === "Pending").length;

  if (loading) {
    return (
      <div className="text-center mt-20 ml-64 text-indigo-600">
        Loading dashboard data...
      </div>
    );
  }

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
              Dashboard Overview
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500"
              >
                <p className="text-sm text-gray-500">Total Tasks</p>
                <p className="text-2xl font-bold">{totalTasks}</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500"
              >
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-red-600">
                  {pendingTasks}
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500"
              >
                <p className="text-sm text-gray-500">Total Employees</p>
                <p className="text-2xl font-bold text-green-600">
                  {employeesCount}
                </p>
              </motion.div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg h-64 flex items-center justify-center">
              <p className="text-gray-500">
                Welcome to the Manager Portal! Use the sidebar to navigate.
              </p>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ManagerIndex;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/axiosInstance";
import { useAuth } from "../../contexts/AuthContext";

// Import New Layout Components
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

const ManagerTasksPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Data Fetching Logic (GET /api/tasks) ---
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // --- Manager Actions (CRUD Stubs) ---
  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.message || "Failed to delete task.");
    }
  };
  const handleEdit = (taskId) => {
    navigate(`/manager/edit-task/${taskId}`);
  };

  // --- Derived Stats ---
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === "Pending").length;
  const employeesCount = new Set(
    tasks.map((t) => t.assignedTo?._id).filter(Boolean)
  ).size;

  // --- Render Content ---

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 1. Sidebar (Fixed on the Left) */}
      <Sidebar />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 overflow-auto ml-64">
        {/* ml-64 pushes content past the 64px wide sidebar */}

        {/* 3. Navbar/Header (Fixed on the Top) */}
        <Navbar />

        {/* 4. Dashboard Main Content Area */}
        <main className="p-8 pt-20">
          {/* pt-20 pushes content past the 16px high navbar */}

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
              Dashboard Overview
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Total Tasks Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500"
              >
                <p className="text-sm text-gray-500">Total Tasks</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {totalTasks}
                </p>
              </motion.div>

              {/* Pending Tasks Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500"
              >
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-red-600">
                  {pendingTasks}
                </p>
              </motion.div>

              {/* Total Employees Card */}
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

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                All Active Tasks
              </h2>
              <button
                onClick={() => navigate("/manager/new-task")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                + Create New Task
              </button>
            </div>

            {/* --- Task Table (from original component) --- */}
            {loading ? (
              <div className="text-center p-10">Loading task data...</div>
            ) : error ? (
              <div className="text-center p-10 text-red-600">
                Error: {error}
              </div>
            ) : (
              <div className="bg-white shadow-xl rounded-xl overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-indigo-500">
                    <tr>
                      <th className="px-6 py-3 text-left font-medium text-white uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left font-medium text-white uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left font-medium text-white uppercase tracking-wider">
                        Assigned To
                      </th>
                      <th className="px-6 py-3 text-left font-medium text-white uppercase tracking-wider">
                        Created By
                      </th>
                      <th className="px-6 py-3 text-right font-medium text-white uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tasks.map((task) => (
                      <tr key={task._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-gray-900 font-medium">
                          {task.title}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              task.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : task.status === "In Progress"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {task.assignedTo?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {task.createdBy?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-right font-medium space-x-2">
                          <button
                            onClick={() => handleEdit(task._id)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(task._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ManagerTasksPage;

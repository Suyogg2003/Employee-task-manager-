import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/axiosInstance";
import { useAuth } from "../../contexts/AuthContext";

// Import New Layout Components
import EmployeeSidebar from "../../components/layout/EmployeeSidebar";
import EmployeeNavbar from "../../components/layout/EmployeeNavbar";

// [StatusDropdown component code goes here, unchanged from previous versions]
// Status Dropdown Component
const StatusDropdown = ({ taskId, currentStatus, onStatusChange }) => {
  const validStatuses = ["Pending", "In Progress", "Completed"];

  const handleChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === currentStatus) return;

    const currentIndex = validStatuses.indexOf(currentStatus);
    const newIndex = validStatuses.indexOf(newStatus);
    if (newIndex < currentIndex) {
      alert(`Cannot go back from ${currentStatus}.`);
      return;
    }

    try {
      await api.put(`/tasks/${taskId}/status`, { newStatus });
      onStatusChange(taskId, newStatus);
    } catch (err) {
      console.error("Status update failed:", err);
      alert(err.response?.data?.message || "Failed to update status.");
    }
  };

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      className="p-1 border border-gray-300 rounded-md text-sm cursor-pointer hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
    >
      {validStatuses.map((status) => (
        <option
          key={status}
          value={status}
          disabled={
            validStatuses.indexOf(status) < validStatuses.indexOf(currentStatus)
          }
        >
          {status}
        </option>
      ))}
    </select>
  );
};

const MyTasksPage = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Data Fetching Logic (GET /api/tasks/my-tasks) ---
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/tasks/my-tasks");
      setTasks(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch assigned tasks."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // --- Data Aggregation for Stats Cards ---
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "In Progress"
  ).length;
  const pendingTasks = tasks.filter((t) => t.status === "Pending").length;

  // --- Status Update Handler (Logic is unchanged) ---
  const handleLocalStatusChange = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  // --- Render Content ---

  if (loading) {
    return (
      <div className="text-center mt-20 text-indigo-600">
        Loading your assigned tasks...
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-20 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 1. Sidebar */}
      <EmployeeSidebar />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 overflow-auto ml-64">
        {/* 3. Navbar/Header (shows name and logout button) */}
        <EmployeeNavbar />

        {/* 4. Dashboard Main Content Area */}
        <main className="p-8 pt-20">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
              Employee Dashboard
            </h1>

            {/* --- Stats Cards Area --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500"
              >
                <p className="text-sm text-gray-500">Completed Tasks</p>
                <p className="text-2xl font-bold text-green-600">
                  {completedTasks}
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500"
              >
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {inProgressTasks}
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500"
              >
                <p className="text-sm text-gray-500">Pending Tasks</p>
                <p className="text-2xl font-bold text-red-600">
                  {pendingTasks}
                </p>
              </motion.div>
            </div>

            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Available Tasks ({tasks.length})
            </h2>

            {/* --- Task Cards (Refactored from original component) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks && tasks.length > 0 ? (
                tasks.map((task) => (
                  <motion.div
                    key={task._id}
                    whileHover={{ y: -3 }}
                    className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-3"
                  >
                    <h3 className="text-xl font-bold text-indigo-700">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Assigned by:{" "}
                      <strong>{task.createdBy?.name || "Manager"}</strong>
                    </p>

                    <p className="text-gray-700 text-sm italic">
                      {task.description}
                    </p>

                    <div className="flex justify-between items-center pt-3 border-t">
                      <span className="text-sm font-medium text-gray-600">
                        Status:
                      </span>

                      <StatusDropdown
                        taskId={task._id}
                        currentStatus={task.status}
                        onStatusChange={handleLocalStatusChange}
                      />
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 col-span-full p-6 bg-white rounded-lg shadow-md">
                  Great job! You currently have no pending tasks assigned.
                </p>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default MyTasksPage;

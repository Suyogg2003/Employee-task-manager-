import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pie } from "react-chartjs-2"; // For the Pie Chart
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"; // Chart.js registration
import api from "../../api/axiosInstance";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const ManagerReportsPage = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]); // Specifically employees for workload
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Data Fetching ---
  useEffect(() => {
    const fetchReportData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [tasksResponse, usersResponse] = await Promise.all([
          api.get("/tasks"),
          // Use manager-only endpoint that returns employees
          api.get("/users/employees"),
        ]);

        setTasks(tasksResponse.data);
        // The server returns employees with `_id`; use returned list directly
        setEmployees(usersResponse.data || []);
      } catch (err) {
        console.error("Reports Data Fetch Error:", err);
        setError(err.response?.data?.message || "Failed to fetch report data.");
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  // --- Data Aggregation for Reports ---
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const inProgressTasks = tasks.filter(
    (t) => t.status === "In Progress"
  ).length;
  const pendingTasks = tasks.filter((t) => t.status === "Pending").length;
  const totalTasks = tasks.length;

  // Pie Chart Data
  const taskStatusData = {
    labels: ["Completed", "In Progress", "Pending"],
    datasets: [
      {
        data: [completedTasks, inProgressTasks, pendingTasks],
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336"], // Green, Yellow, Red
        hoverBackgroundColor: ["#66BB6A", "#FFD54F", "#EF5350"],
        borderWidth: 0,
      },
    ],
  };

  // Employee Workload (Tasks assigned to each employee)
  const employeeWorkload = employees
    .map((employee) => {
      // Server returns `_id` for users; tasks have populated assignedTo._id
      const assigned = tasks.filter(
        (task) => task.assignedTo?._id?.toString() === employee._id?.toString()
      );
      const completed = assigned.filter(
        (task) => task.status === "Completed"
      ).length;
      const inProgress = assigned.filter(
        (task) => task.status === "In Progress"
      ).length;
      const pending = assigned.filter(
        (task) => task.status === "Pending"
      ).length;

      return {
        id: employee._id,
        name: employee.name,
        totalAssigned: assigned.length,
        completed,
        inProgress,
        pending,
      };
    })
    .sort((a, b) => b.totalAssigned - a.totalAssigned); // Sort by total assigned tasks

  // --- Render Content ---

  if (loading) {
    return (
      <div className="text-center mt-20 ml-64 text-indigo-600">
        Generating reports...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20 ml-64 text-red-600">Error: {error}</div>
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
              Performance Reports
            </h1>

            {/* --- Overall Task Status Distribution (Pie Chart) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <motion.div
                whileHover={{ scale: 1.01 }}
                className="bg-white p-6 rounded-xl shadow-lg"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Overall Task Status
                </h2>
                {totalTasks > 0 ? (
                  <div className="h-64 flex items-center justify-center">
                    <Pie
                      data={taskStatusData}
                      options={{ maintainAspectRatio: false }}
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 text-center">
                    No tasks to display in the chart.
                  </p>
                )}
                <div className="mt-4 flex justify-around text-center">
                  <p>
                    <span className="font-bold">{completedTasks}</span>{" "}
                    Completed
                  </p>
                  <p>
                    <span className="font-bold">{inProgressTasks}</span> In
                    Progress
                  </p>
                  <p>
                    <span className="font-bold">{pendingTasks}</span> Pending
                  </p>
                </div>
              </motion.div>

              {/* --- Top-level KPIs --- */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-indigo-500"
                >
                  <p className="text-sm text-gray-500">Total Tasks</p>
                  <p className="text-3xl font-bold">{totalTasks}</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500"
                >
                  <p className="text-sm text-gray-500">Total Employees</p>
                  <p className="text-3xl font-bold">{employees.length}</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500"
                >
                  <p className="text-sm text-gray-500">Completed Last Month</p>
                  <p className="text-3xl font-bold">--</p>{" "}
                  {/* Placeholder, requires date logic */}
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500"
                >
                  <p className="text-sm text-gray-500">Avg. Completion Time</p>
                  <p className="text-3xl font-bold">--</p>{" "}
                  {/* Placeholder, requires date logic */}
                </motion.div>
              </div>
            </div>

            {/* --- Employee Workload Table --- */}
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Employee Workload Overview
            </h2>
            <div className="bg-white shadow-xl rounded-xl overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Assigned
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Completed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      In Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pending
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employeeWorkload.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {emp.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {emp.totalAssigned}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                        {emp.completed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-semibold">
                        {emp.inProgress}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">
                        {emp.pending}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {employees.length === 0 && (
                <p className="p-6 text-center text-gray-500">
                  No employees to generate workload report.
                </p>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ManagerReportsPage;

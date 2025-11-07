import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../api/axiosInstance";
import { useAuth } from "../../contexts/AuthContext";

const NewTaskPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [employees, setEmployees] = useState([]);
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    assignedTo: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ message: "", type: "" });

  // --- Fetch Employees ---
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await api.get("/users/employees");
        setEmployees(response.data);

        if (response.data.length > 0) {
          setTaskData((prev) => ({
            ...prev,
            assignedTo: response.data[0]._id,
          }));
        }
      } catch (err) {
        console.error("Error fetching employees:", err);
        setStatus({
          message:
            err.response?.data?.message || "Failed to load employee list.",
          type: "error",
        });
      }
    };

    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value,
    });
  };

  // --- Submit Task ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ message: "", type: "" });

    if (!taskData.assignedTo) {
      setStatus({ message: "Please select an employee.", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/tasks", taskData);
      setStatus({
        message: `Task "${response.data.title}" created successfully!`,
        type: "success",
      });

      setTimeout(() => navigate("/manager"), 1500);
    } catch (err) {
      console.error("Task creation error:", err);
      setStatus({
        message: err.response?.data?.message || "Task creation failed.",
        type: "error",
      });
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 sm:p-6 md:p-8 bg-gray-200 min-h-screen flex flex-col justify-center"
    >
      <div className="max-w-3xl w-full mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Create New Task
          </h1>
          <button
            onClick={() => navigate("/manager")}
            className="text-indigo-600 hover:text-indigo-800 transition duration-200 text-sm sm:text-base"
          >
            &larr; Back to Dashboard
          </button>
        </div>

        {/* Status Message */}
        {status.message && (
          <div
            className={`p-3 sm:p-4 mb-4 rounded-lg text-sm sm:text-base ${
              status.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status.message}
          </div>
        )}

        {/* Form */}
        <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
          {/* Task Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Task Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg shadow-sm p-2.5 sm:p-3 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
              placeholder="e.g., Develop user registration feature"
              value={taskData.title}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              required
              className="w-full border border-gray-300 rounded-lg shadow-sm p-2.5 sm:p-3 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
              placeholder="Detailed steps for the employee..."
              value={taskData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Assigned To Dropdown */}
          <div>
            <label
              htmlFor="assignedTo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Assign To Employee
            </label>
            <select
              id="assignedTo"
              name="assignedTo"
              required
              className="w-full border border-gray-300 rounded-lg shadow-sm p-2.5 sm:p-3 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
              value={taskData.assignedTo}
              onChange={handleChange}
              disabled={employees.length === 0 || loading}
            >
              {employees.length === 0 ? (
                <option value="">Loading employees...</option>
              ) : (
                employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.name} ({employee.email})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading || employees.length === 0}
            className={`w-full py-2.5 sm:py-3 px-4 border border-transparent text-base font-medium rounded-md text-white transition duration-150 ${
              loading || employees.length === 0
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            }`}
          >
            {loading ? "Creating Task..." : "Create and Assign Task"}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default NewTaskPage;

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/axiosInstance";
import Sidebar from "../../components/layout/Sidebar";
import Navbar from "../../components/layout/Navbar";

const ManagerEmployeesPage = () => {
  // Renamed state variables for clarity: users -> employees
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Placeholder for Modal state (if implementing Edit feature fully)
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/users/employees");
      setEmployees(response.data);
    } catch (err) {
      console.error("Employee fetch error:", err);
      setError(err.response?.data?.message || "Failed to fetch employee list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(); // Call the new fetch function
  }, []);

  // --- Frontend Handlers ---

  // Note: The userId passed here is the user's Mongoose _id (or SQL id)
  const handleDeleteUser = async (userId, userName) => {
    if (
      !window.confirm(
        `Are you sure you want to deactivate ${userName}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      // CALL BACKEND API (Remains the same: DELETE /users/:id)
      await api.delete(`/users/${userId}`);

      // Update UI: Remove the user from the state
      setEmployees(employees.filter((user) => user._id !== userId));
    } catch (err) {
      console.error("Deletion error:", err);
      alert(
        `Error deactivating user: ${
          err.response?.data?.message || "Check server logs."
        }`
      );
    }
  };

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setIsEditing(true);

    alert(`Opening edit form for ${user.name}`);
  };

  // --- Render Content ---

  if (loading) {
    return (
      <div className="text-center mt-20 ml-64 text-indigo-600">
        Loading employee data...
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
              Employee Management
            </h1>

            <p className="mb-6 text-gray-600">
              Total Employees: {employees.length}
            </p>

            {/* --- User Table --- */}
            <div className="bg-white shadow-xl rounded-xl overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {employees.map((user) => (
                    // The user role will always be 'Employee' here, but we render it for consistency.
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id, user.name)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Deactivate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {employees.length === 0 && !loading && (
                <p className="p-6 text-center text-gray-500">
                  No employees found in the system.
                </p>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ManagerEmployeesPage;

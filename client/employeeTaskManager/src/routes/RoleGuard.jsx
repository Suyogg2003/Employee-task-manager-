import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

/**

 * * @param {string} requiredRole 
 */
const RoleGuard = ({ children, requiredRole }) => {
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== requiredRole) {
    console.warn(
      `Access denied. User role: ${role}. Required role: ${requiredRole}.`
    );

    const managerPath = "/manager";
    const employeePath = "/employee";

    if (role === "Manager") {
      return <Navigate to={managerPath} replace />;
    }

    if (role === "Employee") {
      return <Navigate to={employeePath} replace />;
    }

    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default RoleGuard;

import React from "react";
import { Routes, Route } from "react-router-dom";

// Utility and Protection Components
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleGuard from "./routes/RoleGuard";

// Page Imports
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import NewTaskPage from "./pages/manager/NewTaskPage.jsx";
import ManagerIndex from "./pages/manager/ManagerIndex"; // NEW Index Page
import ManagerTasksPage from "./pages/manager/ManagerTasksPage";
import ManagerReportsPage from "./pages/manager/ManagerReportsPage";
import ManagerSettingsPage from "./pages/manager/ManagerSettingsPage";
import ManagerEmployeesPage from "./pages/manager/ManagerEmployeesPage.jsx";

import NotFoundPage from "./pages/NotFoundPage.jsx";
import EmployeeIndex from "./pages/employee/EmployeeIndex";
import MyTasksPage from "./pages/employee/MyTasksPage";
import ProfilePage from "./pages/employee/ProfilePage.jsx";

function App() {
  return (
    // Note: BrowserRouter is imported and used in main.jsx
    <Routes>
      {/* 1. PUBLIC ROUTES */}

      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<RoleGuard requiredRole="Manager" />}>
          {/* 1. Main Dashboard Index (Root: /manager) */}
          <Route path="/manager" element={<ManagerIndex />} />

          {/* 2. Employee Management Page */}
          <Route path="/manager/employees" element={<ManagerEmployeesPage />} />

          {/* 3. Tasks List Page (Renamed from ManagerDashboard) */}
          <Route path="/manager/tasks" element={<ManagerTasksPage />} />

          {/* 4. Reports Page */}
          <Route path="/manager/reports" element={<ManagerReportsPage />} />

          {/* 5. Create New Task (Remains the same) */}
          <Route path="/manager/new-task" element={<NewTaskPage />} />

          {/* 6. Settings Page */}
          <Route path="/manager/settings" element={<ManagerSettingsPage />} />
        </Route>

        {/* EMPLOYEE ROUTES (Requires Role Guard) */}
        <Route element={<RoleGuard requiredRole="Employee" />}>
          <Route path="/employee" element={<EmployeeIndex />} />
          {/* My Tasks (The main task list) */}
          <Route path="/employee/tasks" element={<MyTasksPage />} />
          {/*  Profile Page */}
          <Route path="/employee/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;

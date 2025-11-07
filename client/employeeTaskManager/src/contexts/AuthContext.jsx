import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

//  Auth Provider Component
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const getInitialUser = () => {
    try {
      const userJson = localStorage.getItem("user");
      return userJson ? JSON.parse(userJson) : null;
    } catch (e) {
      console.error("Could not parse user from localStorage", e);
      return null;
    }
  };

  const [user, setUser] = useState(getInitialUser());
  const [isLoading, setIsLoading] = useState(true);

  // Initial load and side effects
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // --- Core Authentication Functions ---

  const register = async (userData) => {
    try {
      // Calls POST /api/auth/register
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, ...userData } = response.data;

      setUser(userData);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      return userData;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    role: user ? user.role : null,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

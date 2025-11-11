import axios from "axios";

// Define the base URL pointing to your Express backend
//const API_URL = "http://localhost:5000/api/";
const API_URL = "https://employee-task-manager-backend-61hf.onrender.com/api/";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach the JWT to every outgoing request
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from local storage
    const token = localStorage.getItem("token");

    // If a token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401 Unauthorized globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error response status is 401 (Unauthorized/Expired Token)
    if (error.response && error.response.status === 401) {
      console.error("Token expired or unauthorized. Logging out user.");

      // Clear the token and user state to force a re-login
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Note: Actual redirection should be handled by AuthContext or a wrapper component
      // to interact correctly with React Router hooks.
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

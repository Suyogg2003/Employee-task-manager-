// server.js (main file)
const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const cors = require("cors");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");

// Connect to database
connectDB();

const app = express();

// Middleware
// Allow configuring allowed origins via environment variable `CORS_ORIGINS`
// Example: CORS_ORIGINS="https://employee-task-manager-jet.vercel.app,http://localhost:5173"
const rawOrigins =
  process.env.CORS_ORIGINS ||
  "https://employee-task-manager-jet.vercel.app,http://localhost:5173,http://localhost:3000";
const allowedOrigins = rawOrigins
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

console.log("CORS allowed origins:", allowedOrigins);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.indexOf("*") !== -1 ||
      allowedOrigins.indexOf(origin) !== -1
    ) {
      return callback(null, true);
    }
    // Otherwise reject
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Handle preflight requests for all routes
app.options("*", cors(corsOptions));
app.use(cors(corsOptions)); // requests from your React frontend
app.use(express.json()); //  handling raw JSON data
app.use(express.urlencoded({ extended: false })); // Allows handling form data

app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);
// Define User Routes
app.use("/api/users", userRoutes);

app.get("/", (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

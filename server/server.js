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
const corsOptions = {
  // Only allow your specific frontend domain(s)
  //origin: ["http://localhost:5173"],
  origin: ["https://employee-task-manager-jet.vercel.app/"],
  methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
  credentials: true, // Crucial if sending cookies/authorization headers
};

app.use(cors(corsOptions)); //requests from your React frontend
app.use(express.json()); //  handling raw JSON data
app.use(express.urlencoded({ extended: false })); // Allows handling form data

app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);
// Define User Routes
app.use("/api/users", userRoutes);

app.get("/", (req, res) => res.send("API is running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

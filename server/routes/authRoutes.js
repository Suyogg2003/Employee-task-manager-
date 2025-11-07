const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

// All routes here are public (no authentication needed)

// Route for new user registration (Manager or Employee)
router.post("/register", registerUser);

// Route for user login
router.post("/login", loginUser);

module.exports = router;

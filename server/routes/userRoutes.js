const express = require("express");
const router = express.Router();

// Import Middleware and Controller
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");
const { getEmployees } = require("../controllers/userController");
const {
  updateUserDetails,
  deleteUser,
} = require("../controllers/userController");

// Manager route to get the list of employees
router.route("/employees").get(protect, restrictTo("Manager"), getEmployees); // Manager-only access

router
  .route("/:id")
  .put(protect, restrictTo("Manager"), updateUserDetails) // Manager can update user details
  .delete(protect, restrictTo("Manager"), deleteUser); // Manager can delete/deactivate a user
module.exports = router;

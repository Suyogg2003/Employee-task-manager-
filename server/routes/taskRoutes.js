const express = require("express");
const router = express.Router();

// Import Middleware and Controller
const { protect } = require("../middleware/authMiddleware");
const { restrictTo } = require("../middleware/roleMiddleware");
const {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  getMyTasks,
  updateTaskStatus,
} = require("../controllers/taskController");
// const { getAllTasks, updateTask, deleteTask, getMyTasks, updateTaskStatus } = require('../controllers/taskController'); // Future imports

// Manager Routes (Protected by auth and role)
router
  .route("/")
  .post(protect, restrictTo("Manager"), createTask)
  .get(protect, restrictTo("Manager"), getAllTasks);

router
  .route("/:id")
  // NEW: PUT /api/tasks/:id - Only a Manager can update any task
  .put(protect, restrictTo("Manager"), updateTask)
  .delete(protect, restrictTo("Manager"), deleteTask);

// Employee Routes:
router.route("/my-tasks").get(protect, getMyTasks);
router.route("/:id/status").put(protect, updateTaskStatus);

module.exports = router;

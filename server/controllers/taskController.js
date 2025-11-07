const Task = require("../models/Task");

const createTask = async (req, res) => {
  const { title, description, assignedTo } = req.body;

  // 1. Basic Validation
  if (!title || !description || !assignedTo) {
    return res.status(400).json({
      message: "Please include title, description, and assigned employee ID.",
    });
  }

  const createdBy = req.user.id;
  try {
    const task = await Task.create({
      title,
      description,
      assignedTo,
      createdBy,
      status: "Pending",
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Task creation failed.", error: error.message });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({})

      .populate("assignedTo", "name email")

      .populate("createdBy", "name")
      .sort({ createdAt: -1 }); // Show newest tasks first

    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve tasks." });
  }
};

const updateTask = async (req, res) => {
  const taskId = req.params.id;
  const updateData = req.body;

  try {
    // 1. Find the task by ID
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      updateData,
      { new: true, runValidators: true } // Return the new document and run Mongoose schema validators
    )
      // 3. Populate user names for the response (optional but good practice)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name");

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    // Handle Mongoose cast error (if ID is invalid) or validation errors
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid task ID format." });
    }
    res.status(500).json({ message: "Failed to update task." });
  }
};

const deleteTask = async (req, res) => {
  const taskId = req.params.id;

  try {
    // 1. Find the task by ID
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    // 2. Perform the deletion
    await Task.deleteOne({ _id: taskId });

    // 3. Send success response
    res.status(200).json({
      message: "Task successfully removed.",
      id: taskId,
    });
  } catch (error) {
    console.error(error);
    // Handle Mongoose cast error (if ID is invalid)
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid task ID format." });
    }
    res.status(500).json({ message: "Failed to delete task." });
  }
};

// Employee functions
const getMyTasks = async (req, res) => {
  const employeeId = req.user.id;

  try {
    // 1. Find tasks where assignedTo matches the logged-in user's ID
    const tasks = await Task.find({ assignedTo: employeeId })
      // 2. Populate the createdBy field to show who assigned the task
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve assigned tasks." });
  }
};

const updateTaskStatus = async (req, res) => {
  const taskId = req.params.id;
  const { newStatus } = req.body;
  const employeeId = req.user.id; // ID from JWT

  const validStatuses = ["Pending", "In Progress", "Completed"];

  if (!validStatuses.includes(newStatus)) {
    return res.status(400).json({ message: "Invalid status value provided." });
  }

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found." });
    }

    if (task.assignedTo.toString() !== employeeId.toString()) {
      return res.status(403).json({
        message:
          "Forbidden. You can only update the status of tasks assigned to you.",
      });
    }

    const currentStatus = task.status;
    const currentIndex = validStatuses.indexOf(currentStatus);
    const newIndex = validStatuses.indexOf(newStatus);

    if (newIndex <= currentIndex && newStatus !== currentStatus) {
      return res.status(400).json({
        message: `Invalid status change: Cannot change task status from ${currentStatus} to ${newStatus}.`,
      });
    }

    // 5. Update the status
    task.status = newStatus;
    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid task ID format." });
    }
    res.status(500).json({ message: "Failed to update task status." });
  }
};

module.exports = {
  // ... other task functions will go here
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  // Employee functions
  getMyTasks,
  updateTaskStatus,
};

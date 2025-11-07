const User = require("../models/User");

const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "Employee" }).select(
      "name email role createdAt"
    );

    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve employee list." });
  }
};

const updateUserDetails = async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;

  // NOTE: Prevent Manager from using this route to change their own password
  if (updateData.password) {
    return res.status(400).json({
      message:
        "Use the separate /api/users/password route for password changes.",
    });
  }

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true } // Return updated doc and validate data
    ).select("-password"); // Exclude password from the response

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user details." });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await User.deleteOne({ _id: userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    res
      .status(200)
      .json({ message: "User successfully deleted/deactivated.", id: userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete user." });
  }
};

module.exports = {
  getEmployees,
  updateUserDetails,
  deleteUser,
};

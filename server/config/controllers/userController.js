const User = require("../models/User");

const getEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "Employee" }).select(
      "name _id email"
    );

    res.status(200).json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve employee list." });
  }
};

module.exports = {
  getEmployees,
};

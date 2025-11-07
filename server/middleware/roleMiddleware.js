/**
 * Middleware to restrict access based on a required user role.
 * @param {string} role - The required role (e.g., 'Manager', 'Employee').
 * @returns {function} Express middleware function.
 */
const restrictTo = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user data missing." });
    }

    if (req.user.role !== role) {
      return res.status(403).json({
        message: `Forbidden. Only users with the '${role}' role can access this resource.`,
      });
    }

    next();
  };
};

module.exports = { restrictTo };

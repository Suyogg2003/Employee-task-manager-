import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFoundPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gray-200 text-center p-4 sm:p-6 md:p-8"
    >
      {/* Animated 404 Heading */}
      <motion.h1
        className="text-7xl sm:text-8xl md:text-9xl font-extrabold text-indigo-600"
        initial={{ rotate: -10 }}
        animate={{ rotate: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
      >
        404
      </motion.h1>

      {/* Title */}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mt-4">
        Page Not Found
      </h2>

      {/* Description */}
      <p className="text-base sm:text-lg text-gray-600 mt-3 max-w-sm sm:max-w-md md:max-w-lg leading-relaxed">
        Sorry, we couldn’t find the page you’re looking for. It might have been
        moved, deleted, or doesn’t exist.
      </p>

      {/* Button */}
      <Link
        to="/"
        className="mt-8 px-5 sm:px-6 py-2.5 sm:py-3 text-base sm:text-lg font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-200 shadow-md"
      >
        Go to Homepage
      </Link>
    </motion.div>
  );
};

export default NotFoundPage;

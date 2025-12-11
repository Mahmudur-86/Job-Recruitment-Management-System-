const express = require("express");
const router = express.Router();

const {
  adminLogin,
  getAllUsers,
  getUserFullDetails,
  updateUserStatus,
  deleteUser,
  getDashboardStats
} = require("../controllers/adminController");

const auth = require("../middleware/authMiddleware");

// Admin login
router.post("/login", adminLogin);

// Protected admin routes
router.use(auth);

// Get all users
router.get("/users", getAllUsers);

// NEW — GET FULL USER DETAILS
router.get("/user/:id/details", getUserFullDetails);

// Update user status
router.post("/user/status", updateUserStatus);

// Delete user
router.delete("/user/:id", deleteUser);

// Dashboard stats
router.get("/stats", getDashboardStats);

module.exports = router;

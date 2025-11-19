const express = require("express");

const {
  adminLogin,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  addUser,
  getDashboardStats
} = require("../controllers/adminController");

const router = express.Router();   //  Declare router 

// Admin login
router.post("/login", adminLogin);

// USERS CRUD
router.get("/users", getAllUsers);
router.post("/user/status", updateUserStatus);
router.delete("/user/:id", deleteUser);
router.post("/user/add", addUser);

//  DASHBOARD STATS ROUTE
router.get("/stats", getDashboardStats);

module.exports = router;

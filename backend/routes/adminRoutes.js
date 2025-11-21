const express = require("express");
const router = express.Router();

const {
  adminLogin,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  addUser,
  getDashboardStats
} = require("../controllers/adminController");

const auth = require("../middleware/authMiddleware");

// Admin login
router.post("/login", adminLogin);

// All other admin features 
router.use(auth);

router.get("/users", getAllUsers);
router.post("/user/status", updateUserStatus);
router.delete("/user/:id", deleteUser);
router.post("/user/add", addUser);
router.get("/stats", getDashboardStats);

module.exports = router;
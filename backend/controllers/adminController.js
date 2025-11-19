const Admin = require("../models/Admin");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ======================================
// ADMIN LOGIN
// ======================================
exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(400).json("Invalid username");

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).json("Wrong password");

  const token = jwt.sign(
    { id: admin._id, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return res.json({
    token,
    admin: { username: admin.username }
  });
};

// ======================================
// GET ALL USERS
// ======================================
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ users });
};

// ======================================
// UPDATE USER STATUS
// ======================================
exports.updateUserStatus = async (req, res) => {
  const { userId, status } = req.body;
  await User.findByIdAndUpdate(userId, { status });
  res.json({ message: "Status updated" });
};

// ======================================
// DELETE USER
// ======================================
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};

// ======================================
// ADD USER (ADMIN CREATE USER)
// ======================================
exports.addUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashed,
    role,
    status: "Active",
  });

  res.json({ message: "User added successfully" });
};

// ======================================
// GET DASHBOARD STATS
// ======================================
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    

    const totalJobs = 0; // If no Jobs model yet
    const totalApplications = 0;
const totalInternshipsAlert = 0;
    res.json({
      totalUsers,
      
      totalJobs,
      totalApplications,
      totalInternshipsAlert,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

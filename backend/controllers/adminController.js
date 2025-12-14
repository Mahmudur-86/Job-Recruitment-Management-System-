const Admin = require("../models/Admin");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const EmployerProfile = require("../models/EmployerProfile");
const JobSeekerProfile = require("../models/JobSeekerProfile");

//  add these for stats
const Job = require("../models/Job");
const Application = require("../models/Application");

// ==============================
// ADMIN LOGIN
// ==============================
exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ username });
  if (!admin) return res.status(400).json("Invalid username");

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(400).json("Wrong password");

  const token = jwt.sign(
    { id: admin._id, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: "127d" }
  );

  return res.json({
    token,
    admin: { username: admin.username },
  });
};

// ==============================
// GET ALL USERS
// ==============================
exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ users });
};

// ==============================
// GET FULL DETAILS FOR EACH USER
// ==============================
exports.getUserFullDetails = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    let profile = null;

    if (user.role === "employer") {
      profile = await EmployerProfile.findOne({ employerId: userId });
    } else {
      profile = await JobSeekerProfile.findOne({ user: userId });
    }

    return res.json({ user, profile });
  } catch (err) {
    console.log("DETAIL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==============================
// UPDATE USER STATUS
// ==============================
exports.updateUserStatus = async (req, res) => {
  const { userId, status } = req.body;
  await User.findByIdAndUpdate(userId, { status });
  res.json({ message: "Status updated" });
};

// ==============================
// DELETE USER
// ==============================
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};

// ==============================
// ADD USER (optional)
// ==============================
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

// ==============================
//  DASHBOARD STATS (REAL)
// ==============================
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const employers = await User.countDocuments({ role: "employer" });

    res.json({
      totalUsers,
      employers,
      totalJobs,
      totalApplications,
      totalInternshipsAlert: 0,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
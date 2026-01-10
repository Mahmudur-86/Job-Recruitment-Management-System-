const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// REGISTER USER

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed,
      role,
      status: "Active"
    });

    return res.json({ message: "Registered successfully" });

  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// LOGIN USER

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // BLOCKED USER CHECK
    if (user.status === "Blocked") {
      return res.status(403).json({ message: "Your account is blocked" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    // GENERATE TOKEN
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "127d" }
    );

    // STORE TOKEN IN COOKIE ALSO 
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict"
    });

    // RETURN TOKEN TO FRONTEND 
    return res.json({
      message: "Login success",
      role: user.role,
      token,
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// LOGOUT USER

exports.logoutUser = (req, res) => {
  res.clearCookie("token");
  return res.json({ message: "Logged out" });
};
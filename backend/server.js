const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

// -------------------------
// DATABASE CONNECT
// -------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

const app = express();

// -------------------------
// MIDDLEWARE (TOP LEVEL)
// MUST BE BEFORE ROUTES
// -------------------------
app.use(express.json());      // BODY PARSER
app.use(cookieParser());      // COOKIE PARSER
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// -------------------------
// ROUTES (AFTER MIDDLEWARE)
// -------------------------

// AUTH ROUTES
app.use("/", authRoutes);

// ADMIN ROUTES
app.use("/api/admin", adminRoutes);

// DEFAULT ROOT
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// -------------------------
// SERVER START
// -------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

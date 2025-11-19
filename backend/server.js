const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

// =============================
// DATABASE CONNECTION
// =============================
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME,   // ⭐ MUST for Atlas
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

const app = express();

// =============================
// GLOBAL MIDDLEWARE
// =============================
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,  // Frontend URL
    credentials: true,
  })
);

// =============================
// ROUTES
// =============================

// Auth routes (register, login, logout)
app.use("/", authRoutes);

// Admin routes (manage users)
app.use("/api/admin", adminRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// =============================
// SERVER START
// =============================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

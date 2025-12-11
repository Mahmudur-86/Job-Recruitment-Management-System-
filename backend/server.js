const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

dotenv.config();

// =======================
// DB CONNECTION
// =======================
mongoose
  .connect(process.env.MONGO_URI, { dbName: process.env.DB_NAME })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

const app = express();

// =======================
// MIDDLEWARE
// =======================
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: true,         // allow all origins (or set to your frontend URL)
    credentials: true,    // allow cookies / auth headers
  })
);

// Serve static files (CVs, images, logos, etc.) from /uploads
// So a file under backend/uploads/company-logos/a.png
// becomes: http://localhost:5000/uploads/company-logos/a.png
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =======================
// IMPORT ROUTES
// =======================
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

// Jobseeker part
const jobRoutes = require("./routes/jobRoutes");
const jobApplicationRoutes = require("./routes/jobApplicationRoutes");
const internRoutes = require("./routes/internRoutes");
// const notificationRoutes = require("./routes/notificationRoutes");
const adminApplicantRoutes = require("./routes/adminApplicantRoutes");

// Employer profile
const employerProfileRoutes = require("./routes/employerProfileRoutes");

// =======================
// USE ROUTES
// =======================

// Admin
app.use("/api/admin", adminRoutes);

// Jobseeker: Browse jobs
app.use("/api/jobs", jobRoutes);

// Jobseeker: Apply to jobs
app.use("/api/job-applications", jobApplicationRoutes);

// Jobseeker: Internship requests
app.use("/api/interns", internRoutes);

// Jobseeker: Notifications (disabled for now)
// app.use("/api/notifications", notificationRoutes);

// Admin: Manage applicants
app.use("/api/admin/applicants", adminApplicantRoutes);

// Jobseeker profile
app.use("/api/profile", profileRoutes);

// Employer profile (the one we just fixed)
// Final endpoints:
//   GET  /api/employer/profile
//   POST /api/employer/profile
app.use("/api/employer", employerProfileRoutes);

// Auth (register, login, logout, etc.)
app.use("/", authRoutes);

// Health-check route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// =======================
// SERVER LISTEN
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

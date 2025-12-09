const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

dotenv.config();

// DB CONNECTION 
mongoose
  .connect(process.env.MONGO_URI, { dbName: process.env.DB_NAME })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Static folder (CV, images, uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// IMPORT ROUTES 
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

// Jobseeker Part (new)
const jobRoutes = require("./routes/jobRoutes");
const jobApplicationRoutes = require("./routes/jobApplicationRoutes");
const internRoutes = require("./routes/internRoutes");
//const notificationRoutes = require("./routes/notificationRoutes");
const adminApplicantRoutes = require("./routes/adminApplicantRoutes");

//  USE ROUTES 

// Admin
app.use("/api/admin", adminRoutes);

// Jobseeker: Browse jobs
app.use("/api/jobs", jobRoutes);

// Jobseeker: Apply job
app.use("/api/job-applications", jobApplicationRoutes);

// Jobseeker: Internship requests
app.use("/api/interns", internRoutes);

// Jobseeker: Notifications
//app.use("/api/notifications", notificationRoutes);

// Admin: Manage applicants
app.use("/api/admin/applicants", adminApplicantRoutes);

// Profile
app.use("/api/profile", profileRoutes);

// Auth
app.use("/", authRoutes);

// Main Check Route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// SERVER LISTEN 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

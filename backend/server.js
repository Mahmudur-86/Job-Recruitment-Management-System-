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

// MIDDLEWARE
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Serve static files from /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// IMPORT ROUTES
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

// Jobseeker part
const jobRoutes = require("./routes/jobRoutes");
const jobApplicationRoutes = require("./routes/jobApplicationRoutes"); // ✅ enabled
const internRoutes = require("./routes/internRoutes");

// Employer profile
const employerProfileRoutes = require("./routes/employerProfileRoutes");

// USE ROUTES
app.use("/api/admin", adminRoutes);
app.use("/api/jobs", jobRoutes);

// applications (job request)
app.use("/api/applications", jobApplicationRoutes);

app.use("/api/interns", internRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/employer", employerProfileRoutes);

// Auth
app.use("/", authRoutes);

// Health-check
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// SERVER LISTEN
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
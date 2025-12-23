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
const adminJobRoutes = require("./routes/adminJobRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

// Jobseeker part
const jobRoutes = require("./routes/jobRoutes");
const jobApplicationRoutes = require("./routes/jobApplicationRoutes"); 
const internRoutes = require("./routes/internRoutes");




//   Notifications + Interviews routes
const notificationRoutes = require("./routes/notificationRoutes");
const interviewRoutes = require("./routes/interviewRoutes");


//  Email route
const emailRoutes = require("./routes/emailRoutes");



// USE ROUTES
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminJobRoutes);
app.use("/api/jobs", jobRoutes);

// applications (job request)
app.use("/api/applications", jobApplicationRoutes);

app.use("/api/interns", internRoutes);
app.use("/api/profile", profileRoutes);





//  mounts
app.use("/api/notifications", notificationRoutes);
app.use("/api/interviews", interviewRoutes);


//  NEW mount
app.use("/api/email", emailRoutes);

// Auth
app.use("/", authRoutes);


app.get("/", (req, res) => {
  res.send("Backend is running");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
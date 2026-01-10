// controllers/jobController.js
const Job = require("../models/Job");

// GET /api/jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .select("-mcqs") //  JobSeeker/public: mcqs hide
      .sort({ createdAt: -1 });

    return res.json(jobs);
  } catch (err) {
    console.log("GET JOBS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

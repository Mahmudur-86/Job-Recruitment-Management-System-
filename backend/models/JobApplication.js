// models/JobApplication.js
const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    jobTitle: { type: String, required: true },
    company: { type: String, required: true },
    appliedDate: { type: Date, required: true },
    cvName: { type: String, required: true },
    mcqHistory: [
      {
        question: { type: String, required: true },
        selectedOption: { type: String, required: true },
      }
    ],
    status: { type: String, default: "Pending" }, // Track the application status (pending, approved, etc.)
  },
  { timestamps: true } // To automatically include createdAt and updatedAt fields
);

module.exports = mongoose.model("JobApplication", jobApplicationSchema);

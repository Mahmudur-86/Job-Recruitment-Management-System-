const mongoose = require("mongoose");

const jobApplicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    jobTitle: String,
    company: String,

    appliedDate: String,

    name: String,
    email: String,
    cv: String,   // ONLY cv name

    correctCount: Number,
    totalQuestions: Number,
    score: Number,

    status: { type: String, default: "Pending" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobApplication", jobApplicationSchema);

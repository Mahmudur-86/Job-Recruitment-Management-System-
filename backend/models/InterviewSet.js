const mongoose = require("mongoose");

const interviewSetSchema = new mongoose.Schema(
  {
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },

    title: { type: String, required: true },
    questions: [
      {
        q: { type: String, required: true },
        options: [{ type: String, required: true }],
      },
    ],

    createdByAdminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("InterviewSet", interviewSetSchema);

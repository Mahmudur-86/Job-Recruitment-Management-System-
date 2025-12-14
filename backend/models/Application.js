const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },

    // snapshot of CV when applied
    cvUrl: { type: String, required: true },
    cvName: { type: String, default: "" },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    //  use for interview part
    interviewSent: { type: Boolean, default: false },
interviewSentAt: { type: Date },
interviewSetId: { type: mongoose.Schema.Types.ObjectId, ref: "InterviewSet" },
  },
  { timestamps: true }
);

// prevent duplicate apply for same job
applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
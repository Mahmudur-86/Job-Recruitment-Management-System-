// backend/models/EmailLog.js
const mongoose = require("mongoose");

const emailLogSchema = new mongoose.Schema(
  {
    sentBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // admin

    to: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },

    
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application", required: true },

    messageId: { type: String, default: "" },
    status: { type: String, enum: ["SENT", "FAILED"], default: "SENT" },
    error: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmailLog", emailLogSchema);

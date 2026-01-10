// backend/models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    
    type: { type: String, enum: ["INTERVIEW", "EMAIL"], required: true },

    title: { type: String, default: "" },
    message: { type: String, default: "" },

    data: {
      applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
      interviewSetId: { type: mongoose.Schema.Types.ObjectId, ref: "InterviewSet" },

      
      emailLogId: { type: mongoose.Schema.Types.ObjectId, ref: "EmailLog" },
    },

    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);

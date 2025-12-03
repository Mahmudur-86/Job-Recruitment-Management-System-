const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    message: String,
    date: String,

    // job or intern notification
    notifyType: {
      type: String,
      enum: ["job", "intern", "system"],
      default: "system"
    },

    seen: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);

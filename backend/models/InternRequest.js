const mongoose = require("mongoose");

const internRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    studentName: String,
    studentId: String,
    university: String,
    batch: String,
    department: String,
    email: String,
    cvName: String,   // only file name

    status: { type: String, default: "pending" },
    submittedDate: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("InternRequest", internRequestSchema);

// models/EmployerProfile.js
const mongoose = require("mongoose");

const employerProfileSchema = new mongoose.Schema(
  {
    // comes from JWT decoded 'userId' via authMiddleware
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true,
    },
    EmployerName: { type: String, trim: true },
    CompanyName: { type: String, trim: true },
    email: { type: String, trim: true },
    address: { type: String, trim: true },
    phone: { type: String, trim: true },
    website: { type: String, trim: true },
    
    companyLogo: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EmployerProfile", employerProfileSchema);
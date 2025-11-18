const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // Common fields
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // Role system
  role: { type: String, enum: ["jobseeker", "employer"], required: true },

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

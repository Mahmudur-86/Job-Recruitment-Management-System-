const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
}, {
  collection: "admin"  // FIXED
});

module.exports = mongoose.model("Admin", adminSchema);
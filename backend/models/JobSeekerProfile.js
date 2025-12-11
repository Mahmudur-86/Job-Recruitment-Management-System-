const mongoose = require("mongoose");

const jobSeekerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    name: String,
    email: String,
    phone: String,
    address: String,
    age: Number,
    gender: String,
    jobInterest: String,
    bio: String,

    skills: String,
    education: String,
    experience: String,

    portfolio: String,
    github: String,
    linkedin: String,

    //  profile image URL 
    profileImageUrl: String,

    // existing CV URL
    cvUrl: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobSeekerProfile", jobSeekerProfileSchema);

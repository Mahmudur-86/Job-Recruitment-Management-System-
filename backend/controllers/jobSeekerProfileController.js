const path = require("path");
const JobSeekerProfile = require("../models/JobSeekerProfile");

// GET /api/profile/me
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await JobSeekerProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (err) {
    console.error("getMyProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// POST /api/profile   (create / update)
exports.updateMyProfile = async (req, res) => {
  try {
    //  take all text fields from form-data
    const fields = { ...req.body };
    if (req.files && req.files.cv && req.files.cv[0]) {
      fields.cvUrl = "/uploads/cv/" + req.files.cv[0].filename;
    }
    if (req.files && req.files.profileImage && req.files.profileImage[0]) {
      fields.profileImageUrl =
        "/uploads/profile-images/" + req.files.profileImage[0].filename;
    }
    const profile = await JobSeekerProfile.findOneAndUpdate(
      { user: req.user.id },
      { $set: fields },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json({ message: "Profile saved", profile });
  } catch (err) {
    console.error("updateMyProfile error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

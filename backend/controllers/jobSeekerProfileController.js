const JobSeekerProfile = require("../models/JobSeekerProfile");

// GET profile
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await JobSeekerProfile.findOne({ user: req.user.id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE/UPDATE
exports.updateMyProfile = async (req, res) => {
  try {
    const fields = { ...req.body };

    if (req.file) {
      fields.cvUrl = "/uploads/cv/" + req.file.filename;
    }

    const profile = await JobSeekerProfile.findOneAndUpdate(
      { user: req.user.id },
      { $set: fields },
      { new: true, upsert: true }
    );

    res.json({ message: "Profile saved", profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

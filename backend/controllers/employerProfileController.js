// controllers/employerProfileController.js
const EmployerProfile = require("../models/EmployerProfile");


// GET /api/employer/profile   current employer

exports.getMyEmployerProfile = async (req, res) => {
  try {
    // comes from authMiddleware (decoded token)
    const employerId = req.user.id;

    const profile = await EmployerProfile.findOne({ employerId });

    if (!profile) {
      // easier for frontend: { profile: null } instead of 404
      return res.status(200).json({ profile: null });
    }

    return res.status(200).json({ profile });
  } catch (err) {
    console.error("Error loading employer profile:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// POST /api/employer/profile   create / update current employer

exports.upsertMyEmployerProfile = async (req, res) => {
  try {
    const employerId = req.user.id; // from authMiddleware

    const {
      EmployerName,
      CompanyName,
      email,
      address,
      phone,
      website,
    } = req.body;

    let companyLogo;

    
    if (req.file) {
      // Convert Windows backslashes to forward slashes
      const fullPath = req.file.path.replace(/\\/g, "/");
     
      

      // Take only the part after "uploads/"
      const afterUploads = fullPath.split("uploads/")[1]; // "company-logos/1765....png"

      // Final relative path saved in DB:
      companyLogo = "uploads/" + afterUploads; // "uploads/company-logos/1765....png"
    }

    const updateData = {
      EmployerName,
      CompanyName,
      email,
      address,
      phone,
      website,
    };

    if (companyLogo) {
      updateData.companyLogo = companyLogo;
    }

    const profile = await EmployerProfile.findOneAndUpdate(
      { employerId },
      { $set: updateData, $setOnInsert: { employerId } },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      message: "Employer profile saved successfully",
      profile,
    });
  } catch (err) {
    console.error("Error saving employer profile:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
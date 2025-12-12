const Application = require("../models/Application");
const JobSeekerProfile = require("../models/JobSeekerProfile");

// ===============================
// Jobseeker: POST /api/applications
// ===============================
exports.createApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.body;

    if (!jobId) return res.status(400).json({ message: "jobId is required" });

    // get CV from jobseeker profile
    const profile = await JobSeekerProfile.findOne({ user: userId });
    if (!profile || !profile.cvUrl) {
      return res.status(400).json({ message: "Upload CV first from Profile" });
    }

    const cvUrl = profile.cvUrl;
    const cvName = profile.cvName || (cvUrl ? cvUrl.split("/").pop() : "");

    const app = await Application.create({
      userId,
      jobId,
      cvUrl,
      cvName,
    });

    return res.status(201).json({
      message: "Application submitted",
      application: app,
    });
  } catch (err) {
    // duplicate apply for same job
    if (err?.code === 11000) {
      return res.status(409).json({ message: "You already applied for this job" });
    }

    console.log("CREATE APPLICATION ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// Jobseeker: GET /api/applications/my
// ===============================
exports.getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const apps = await Application.find({ userId })
      .populate("jobId", "title company location category salary")
      .sort({ createdAt: -1 });

    return res.json({ applications: apps });
  } catch (err) {
    console.log("MY APPLICATIONS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// ✅ Jobseeker: DELETE /api/applications/:id
// (Remove Job Request)
// ===============================
exports.deleteMyApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const appId = req.params.id;

    // find application
    const app = await Application.findById(appId);
    if (!app) return res.status(404).json({ message: "Application not found" });

    // security: only owner can delete
    if (String(app.userId) !== String(userId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // Optional: only allow removing if Pending (recommended)
    if (app.status !== "Pending") {
      return res.status(400).json({
        message: "You can only remove a Pending request",
      });
    }

    await Application.findByIdAndDelete(appId);

    return res.json({ message: "Application removed successfully" });
  } catch (err) {
    console.log("DELETE MY APPLICATION ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

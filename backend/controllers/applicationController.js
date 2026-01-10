const Application = require("../models/Application");
const JobSeekerProfile = require("../models/JobSeekerProfile");
const Job = require("../models/Job");
//  normalize text
const normalize = (s) =>
  String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
// Jobseeker: POST /api/applications
exports.createApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.body;
    if (!jobId) return res.status(400).json({ message: "jobId is required" });
    //  get profile (CV + Job Interest)
    const profile = await JobSeekerProfile.findOne({ user: userId });
    if (!profile || !profile.cvUrl) {
      return res.status(400).json({ message: "Upload CV first from Profile" });
    }
    //  job interest must exist
    if (!profile.jobInterest) {
      return res
        .status(400)
        .json({ message: "Set your Job Interest first from Profile" });
    }
    //  load job data for matching
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const interest = normalize(profile.jobInterest);
    const titleText = normalize(job.title);
    const reqText = normalize(job.requirements);
    //  interest match rule: title 
    const isMatched = titleText.includes(interest) || reqText.includes(interest);
    if (!isMatched) {
      return res.status(403).json({
        message: `This job doesn't match your interest (${profile.jobInterest}).`,
      });
    }
    //  prepare CV details
    const cvUrl = profile.cvUrl;
    const cvName = profile.cvName || (cvUrl ? cvUrl.split("/").pop() : "");
    //  create application
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
    
    if (err?.code === 11000) {
      return res
        .status(409)
        .json({ message: "You already applied for this job" });
    }
    console.log("CREATE APPLICATION ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
// Jobseeker: GET /api/applications/my
exports.getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;

    const apps = await Application.find({ userId })
      .populate("jobId", "title company location category salary requirements")
      .sort({ createdAt: -1 });
    return res.json({ applications: apps });
  } catch (err) {
    console.log("MY APPLICATIONS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
//  Jobseeker: DELETE /api/applications/:id
exports.deleteMyApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const appId = req.params.id;

    const app = await Application.findById(appId);
    if (!app) return res.status(404).json({ message: "Application not found" });

    //  only admin can delete
    if (String(app.userId) !== String(userId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    //  only Pending can be removed 
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

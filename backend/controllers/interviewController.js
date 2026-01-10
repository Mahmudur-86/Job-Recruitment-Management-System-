const Application = require("../models/Application");
const InterviewSet = require("../models/InterviewSet");
const InterviewSubmission = require("../models/InterviewSubmission");
const Notification = require("../models/Notification");

// JobSeeker: Get interview questions
// GET /api/interviews/application/:applicationId
exports.getInterviewByApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const app = await Application.findById(applicationId);
    if (!app) return res.status(404).json({ message: "Application not found" });
    if (String(app.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (!app.interviewSetId) {
      return res.status(404).json({ message: "Interview not sent yet" });
    }
    const set = await InterviewSet.findById(app.interviewSetId);
    if (!set) return res.status(404).json({ message: "Interview set not found" });
    res.json({
      interviewSetId: set._id,
      title: set.title,
      questions: set.questions,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// JobSeeker: Submit answers
// POST /api/interviews/application/:applicationId/submit
exports.submitInterview = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { answers } = req.body;
    const app = await Application.findById(applicationId);
    if (!app) return res.status(404).json({ message: "Application not found" });
    if (String(app.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (!app.interviewSetId) {
      return res.status(400).json({ message: "Interview not sent yet" });
    }
    const exists = await InterviewSubmission.findOne({
      applicationId,
      userId: req.user.id,
    });
    if (exists) {
      return res.status(400).json({ message: "Already submitted" });
    }
    const submission = await InterviewSubmission.create({
      interviewSetId: app.interviewSetId,
      applicationId,
      userId: req.user.id,
      answers,
    });
    await Notification.updateMany(
      { userId: req.user.id, type: "INTERVIEW", "data.applicationId": applicationId },
      { isRead: true }
    );
    res.json({
      message: "Interview submitted successfully",
      submissionId: submission._id,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

//  ADMIN: Applications list
// GET /api/interviews/admin/applications
exports.getAdminApplications = async (req, res) => {
  try {
    // only admin
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const applications = await Application.find()
      .populate("userId", "name email")
      .populate("jobId", "title company")
      .sort({ createdAt: -1 });

    // attach submission info (hasSubmitted + submittedAt)
    const appIds = applications.map((a) => a._id);
    const subs = await InterviewSubmission.find({ applicationId: { $in: appIds } })
      .select("applicationId createdAt");
    const map = new Map();
    subs.forEach((s) => map.set(String(s.applicationId), s));
    const final = applications.map((a) => {
      const sub = map.get(String(a._id));
      return {
        ...a.toObject(),
        hasSubmitted: !!sub,
        submittedAt: sub?.createdAt || null,
      };
    });
    return res.json({ applications: final });
  } catch (err) {
    console.log("ADMIN APPLICATIONS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

//  ADMIN: View interview answers
// GET /api/interviews/admin/application/:applicationId/submission
exports.getSubmissionForAdmin = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }
    const { applicationId } = req.params;
    const app = await Application.findById(applicationId);
    if (!app) return res.status(404).json({ message: "Application not found" });
    if (!app.interviewSetId) {
      return res.status(404).json({ message: "Interview not sent yet" });
    }
    const set = await InterviewSet.findById(app.interviewSetId);
    if (!set) return res.status(404).json({ message: "Interview set not found" });
    const submission = await InterviewSubmission.findOne({ applicationId });
    return res.json({
      applicationId,
      title: set.title,
      questions: set.questions,
      answers: submission?.answers || [],
      submittedAt: submission?.createdAt || null,
    });
  } catch (err) {
    console.log("ADMIN SUBMISSION ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
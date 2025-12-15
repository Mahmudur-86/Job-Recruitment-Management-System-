const Application = require("../models/Application");
const InterviewSet = require("../models/InterviewSet");
const InterviewSubmission = require("../models/InterviewSubmission");
const Notification = require("../models/Notification");

// =================================================
// JobSeeker: Get interview questions
// GET /api/interviews/application/:applicationId
// =================================================
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

// =================================================
// JobSeeker: Submit answers
// POST /api/interviews/application/:applicationId/submit
// =================================================
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

// =================================================
// Employer: View answers
// GET /api/interviews/application/:applicationId/submission
// =================================================
exports.getSubmissionForEmployer = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const app = await Application.findById(applicationId);
    if (!app) return res.status(404).json({ message: "Application not found" });

    if (!app.interviewSetId) {
      return res.status(404).json({ message: "Interview not sent yet" });
    }

    const set = await InterviewSet.findById(app.interviewSetId);
    const submission = await InterviewSubmission.findOne({ applicationId });

    res.json({
      applicationId,
      title: set.title,
      questions: set.questions,
      answers: submission?.answers || [],
      submittedAt: submission?.createdAt || null,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// =================================================
// Employer: Get applications list (NO admin role)
// GET /api/interviews/employer/applications
// =================================================
exports.getEmployerApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("userId", "name email")
      .populate("jobId", "title company")
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

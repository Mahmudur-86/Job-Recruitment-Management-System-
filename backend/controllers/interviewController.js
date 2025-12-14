const Application = require("../models/Application");
const InterviewSet = require("../models/InterviewSet");
const InterviewSubmission = require("../models/InterviewSubmission");
const Notification = require("../models/Notification");

exports.getInterviewByApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const app = await Application.findById(applicationId);
    if (!app) return res.status(404).json({ message: "Application not found" });

    // only the owner can see
    if (String(app.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!app.interviewSetId) {
      return res.status(404).json({ message: "Interview not sent yet" });
    }

    const set = await InterviewSet.findById(app.interviewSetId);
    if (!set) return res.status(404).json({ message: "Interview set not found" });

    return res.json({
      interviewSetId: set._id,
      title: set.title,
      questions: set.questions,
    });
  } catch (err) {
  console.log("SUBMIT INTERVIEW ERROR:", err);
  return res.status(500).json({ message: "Server error", error: err.message });
}
};

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

    // prevent double submit
    const already = await InterviewSubmission.findOne({
      applicationId,
      userId: req.user.id,
    });
    if (already) return res.status(400).json({ message: "Already submitted" });

    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: "answers must be an array" });
    }

    const submission = await InterviewSubmission.create({
      interviewSetId: app.interviewSetId,
      applicationId,
      userId: req.user.id,
      answers,
    });

    // optional: mark related notifications read
    await Notification.updateMany(
      { userId: req.user.id, "data.applicationId": applicationId, type: "INTERVIEW" },
      { isRead: true }
    );

    return res.json({ message: "Interview submitted", submissionId: submission._id });
  } catch (err) {
    console.log("SUBMIT INTERVIEW ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

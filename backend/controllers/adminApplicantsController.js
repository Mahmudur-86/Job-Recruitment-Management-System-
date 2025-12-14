const Application = require("../models/Application");
const InterviewSet = require("../models/InterviewSet");
const Notification = require("../models/Notification");

const ensureAdmin = (req, res) => {
  if (req.user?.role !== "admin") {
    res.status(403).json({ message: "Admin only" });
    return false;
  }
  return true;
};

// Dummy MCQ generator (same as your frontend logic)
const getDummyQuestions = (jobTitle = "") => {
  const t = String(jobTitle).toLowerCase();

  if (t.includes("mern")) {
    return {
      title: "MERN Developer (3 MCQ)",
      questions: [
        {
          q: "Which stack correctly represents MERN?",
          options: [
            "MongoDB, Express, React, Node.js",
            "MySQL, Express, Redux, Node.js",
            "MongoDB, Electron, React, Next.js",
            "MariaDB, Ember, React, Node.js",
          ],
        },
        {
          q: "In Express.js, which method is commonly used to parse JSON request bodies?",
          options: ["express.json()", "bodyParser.html()", "app.view()", "req.parse()"],
        },
        {
          q: "In MongoDB, which command is used to find documents that match a filter?",
          options: ["find()", "select()", "get()", "match()"],
        },
      ],
    };
  }

  return {
    title: "General Interview (3 MCQ)",
    questions: [
      { q: "Which one is a database?", options: ["MongoDB", "React", "HTML", "Tailwind"] },
      { q: "HTTP status code for Success is:", options: ["200", "404", "500", "301"] },
      { q: "Which one is a JavaScript framework/library?", options: ["Laravel", "Django", "React", "Flask"] },
    ],
  };
};

// Admin: GET /api/admin/applications
exports.getAllApplications = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const apps = await Application.find()
      .populate("userId", "name email")
      .populate("jobId", "title company")
      .sort({ createdAt: -1 });

    return res.json({ applications: apps });
  } catch (err) {
    console.log("ADMIN GET APPLICATIONS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Admin: PATCH /api/admin/applications/:id/status
exports.updateApplicationStatus = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const { status } = req.body;
    const allowed = ["Pending", "Approved", "Rejected"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Application not found" });
    return res.json({ message: "Status updated", application: updated });
  } catch (err) {
    console.log("ADMIN UPDATE STATUS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Admin: DELETE /api/admin/applications/:id
exports.deleteApplication = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const deleted = await Application.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Application not found" });

    return res.json({ message: "Application deleted" });
  } catch (err) {
    console.log("ADMIN DELETE APPLICATION ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Admin: POST /api/admin/applications/:id/send-interview
exports.sendInterview = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const app = await Application.findById(req.params.id)
      .populate("userId", "name email")
      .populate("jobId", "title company");

    if (!app) return res.status(404).json({ message: "Application not found" });

    // only approved
    if (app.status !== "Approved") {
      return res.status(400).json({
        message: "Only Approved applicants can receive interview questions.",
      });
    }

    // optional: prevent re-sending same interview
    if (app.interviewSent && app.interviewSetId) {
      return res.status(400).json({ message: "Interview already sent for this application." });
    }

    // allow custom questions from admin (optional)
    let { title, questions } = req.body || {};
    if (!title || !Array.isArray(questions) || questions.length === 0) {
      const dummy = getDummyQuestions(app.jobId?.title || "");
      title = dummy.title;
      questions = dummy.questions;
    }

    // create InterviewSet
    const interviewSet = await InterviewSet.create({
      applicationId: app._id,
      userId: app.userId?._id,
      jobId: app.jobId?._id,
      title,
      questions,
      createdByAdminId: req.user.id,
    });

    // update application
    app.interviewSent = true;
    app.interviewSentAt = new Date();
    app.interviewSetId = interviewSet._id;
    await app.save();

    // create Notification for jobseeker
    await Notification.create({
      userId: app.userId?._id,
      type: "INTERVIEW",
      title: "Interview Questions",
      message: `You are accepted for ${app.jobId?.title || "the job"}. Please submit the interview MCQ.`,
      data: {
        applicationId: app._id,
        interviewSetId: interviewSet._id,
      },
      isRead: false,
    });

    return res.json({
      message: "Interview sent to jobseeker notifications.",
      interviewSetId: interviewSet._id,
    });
  } catch (err) {
    console.log("ADMIN SEND INTERVIEW ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

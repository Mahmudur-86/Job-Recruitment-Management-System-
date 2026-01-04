// backend/routes/emailRoutes.js
const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const transporter = require("../utils/mailer");

const Application = require("../models/Application");
const EmailLog = require("../models/EmailLog");
const Notification = require("../models/Notification");

// POST /api/email/send
router.post("/send", authMiddleware, async (req, res) => {
  const { to, subject, message, jobId, applicationId } = req.body || {};

  if (!to || !subject || !message) {
    return res.status(400).json({ message: "to, subject, message are required" });
  }

  // ✅ MUST: both (no null, no optional)
  if (!jobId || !applicationId) {
    return res.status(400).json({ message: "jobId and applicationId are required" });
  }

  // admin only
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }

  // ✅ Verify: application exists + belongs to this job
  const app = await Application.findById(applicationId)
    .select("_id jobId userId")
    .lean();

  if (!app) {
    return res.status(404).json({ message: "Application not found" });
  }

  if (String(app.jobId) !== String(jobId)) {
    return res.status(400).json({ message: "jobId does not match this application" });
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      text: message,
      html: `<div style="font-family:Arial;line-height:1.6">
              <p>${String(message).replace(/\n/g, "<br/>")}</p>
            </div>`,
    });

    // ✅ Save EmailLog (never null)
    const log = await EmailLog.create({
      sentBy: req.user.id,
      to,
      subject,
      message,
      jobId,
      applicationId,
      messageId: info?.messageId || "",
      status: "SENT",
      error: "",
    });

    // ✅ Notify jobseeker (use app.userId)
    await Notification.create({
      userId: app.userId,
      type: "EMAIL",
      title: "Email Sent",
      message: "Please check your email inbox.",
      data: { applicationId, emailLogId: log._id },
      isRead: false,
    });

    return res.json({
      success: true,
      message: "Email sent successfully",
      messageId: info?.messageId || "",
      logId: log._id,
    });
  } catch (err) {
    console.error("EMAIL SEND ERROR:", err);

    // log FAILED (still no null)
    try {
      await EmailLog.create({
        sentBy: req.user.id,
        to,
        subject,
        message,
        jobId,
        applicationId,
        messageId: "",
        status: "FAILED",
        error: err?.message || "Unknown error",
      });
    } catch (e2) {
      console.error("EMAIL LOG SAVE FAILED:", e2);
    }

    return res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: err?.message || "Unknown error",
    });
  }
});

// ✅ Optional helper: GET /api/email/logs (Admin only)
router.get("/logs", authMiddleware, async (req, res) => {
  try {
    if (req.user?.role !== "admin") return res.status(403).json({ message: "Admin only" });

    const { jobId, applicationId, to, status, limit = 50 } = req.query || {};
    const filter = {};
    if (jobId) filter.jobId = jobId;
    if (applicationId) filter.applicationId = applicationId;
    if (to) filter.to = String(to).trim();
    if (status) filter.status = String(status).trim();

    const logs = await EmailLog.find(filter)
      .sort({ createdAt: -1 })
      .limit(Math.min(Number(limit) || 50, 200))
      .populate("sentBy", "name email role");

    return res.json({ logs });
  } catch (err) {
    console.error("EMAIL LOGS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

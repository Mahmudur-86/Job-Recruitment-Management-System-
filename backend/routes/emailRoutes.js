const express = require("express");
const transporter = require("../utils/mailer");
const authMiddleware = require("../middleware/authMiddleware"); //  path check below

const router = express.Router();

// POST /api/email/send
router.post("/send", authMiddleware, async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({
        message: "to, subject, message are required",
      });
    }

    //  Optional: only employer/admin can send
    // if (req.user?.role !== "employer" && req.user?.role !== "admin") {
    //   return res.status(403).json({ message: "Forbidden" });
    // }

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      text: message,
      html: `<div style="font-family:Arial;line-height:1.6">
              <p>${String(message).replace(/\n/g, "<br/>")}</p>
            </div>`,
    });

    return res.json({
      success: true,
      message: "Email sent successfully",
      messageId: info.messageId,
      sentBy: req.user?.id, //  coming from your middleware :contentReference[oaicite:1]{index=1}
      to,
      subject,
    });
  } catch (err) {
    console.error("EMAIL SEND ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: err?.message || "Unknown error",
    });
  }
});

module.exports = router;

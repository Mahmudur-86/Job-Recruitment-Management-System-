// backend/controllers/recruitmentLetterController.js

const RecruitmentLetter = require("../models/RecruitmentLetter");
const User = require("../models/User");
const PDFDocument = require("pdfkit");

// ✅ added for email + pdf attachment
const transporter = require("../utils/mailer");
const { PassThrough } = require("stream");

// ---------- guards ----------
const ensureRole = (role) => (req, res) => {
  if (!req.user || req.user.role !== role) {
    res.status(403).json({ message: "Forbidden" });
    return false;
  }
  return true;
};

// ---------- helper ----------
const pickJobSeeker = (u) => ({
  _id: u._id,
  name: u.name || u.fullName || u.username || "",
  email: u.email || "",
  address: u.address || u.location || "",
  role: u.role,
});

// ✅ helper: build email body (text + html)
const buildLetterEmail = (letter) => {
  const subject = letter.subject || `Recruitment Letter - ${letter.companyName || "Company"}`;

  const text = `
Recruitment Letter

Company: ${letter.companyName || "-"}
Ref: ${letter.letterRefNo || "-"}
Date: ${letter.issueDate || "-"}

To,
${letter.candidateName || "Job Seeker"}
${letter.candidateEmail ? `Email: ${letter.candidateEmail}` : ""}

Subject: ${subject}

Dear ${letter.candidateName || "Job Seeker"},

We are pleased to offer you the position of ${letter.positionTitle || "-"}${
    letter.department ? ` in the ${letter.department} department` : ""
  } at ${letter.companyName || "our company"}.

Employment Type: ${letter.employmentType || "-"}
Work Location: ${letter.workLocation || "-"}

Offer Details:
- Start Date: ${letter.startDate || "-"}
- Salary: ${letter.salaryAmount || "-"} ${letter.salaryFrequency ? `(${letter.salaryFrequency})` : ""}
- Probation Period: ${letter.probationPeriod || "-"}
- Working Hours: ${letter.workingHours || "-"}
- Reporting To: ${letter.reportingTo || "-"}
- Office Address: ${letter.officeAddress || "-"}

${letter.extraTerms ? `Additional Terms:\n${letter.extraTerms}\n` : ""}

We look forward to welcoming you to our team.

Sincerely,
${letter.hrName || "-"}
${letter.hrTitle || "-"}
${letter.companyName || "-"}

`.trim();

  const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color:#111;">
    <h2 style="margin:0 0 6px 0;">Recruitment Letter</h2>
    <div style="color:#444; font-size:13px;">
      <div><b>Company:</b> ${letter.companyName || "-"}</div>
      <div><b>Ref:</b> ${letter.letterRefNo || "-"}</div>
      <div><b>Date:</b> ${letter.issueDate || "-"}</div>
    </div>

    <hr style="border:none;border-top:1px solid #eee; margin:14px 0;" />

    <p style="margin:0;"><b>To,</b></p>
    <p style="margin:6px 0 0 0;"><b>${letter.candidateName || "Job Seeker"}</b></p>
    ${letter.candidateEmail ? `<p style="margin:2px 0; color:#444;">${letter.candidateEmail}</p>` : ""}

    <p style="margin:14px 0 0 0;"><b>Subject:</b> ${subject}</p>

    <p>Dear <b>${letter.candidateName || "Job Seeker"}</b>,</p>

    <p>
      We are pleased to offer you the position of <b>${letter.positionTitle || "-"}</b>
      ${letter.department ? ` in the <b>${letter.department}</b> department` : ""}
      at <b>${letter.companyName || "our company"}</b>.
    </p>

    <p>
      <b>Employment Type:</b> ${letter.employmentType || "-"}<br/>
      <b>Work Location:</b> ${letter.workLocation || "-"}
    </p>

    <p><b>Offer Details:</b></p>
    <ul>
      <li>Start Date: ${letter.startDate || "-"}</li>
      <li>Salary: ${letter.salaryAmount || "-"} ${letter.salaryFrequency ? `(${letter.salaryFrequency})` : ""}</li>
      <li>Probation Period: ${letter.probationPeriod || "-"}</li>
      <li>Working Hours: ${letter.workingHours || "-"}</li>
      <li>Reporting To: ${letter.reportingTo || "-"}</li>
      <li>Office Address: ${letter.officeAddress || "-"}</li>
    </ul>

    ${letter.extraTerms ? `<p style="white-space:pre-line;">${String(letter.extraTerms)}</p>` : ""}

    <p>We look forward to welcoming you to our team.</p>

    <p style="margin-top:18px;">
      Sincerely,<br/>
      <b>${letter.hrName || "-"}</b><br/>
      <span style="color:#444;">${letter.hrTitle || "-"}</span><br/>
      <span style="color:#444;">${letter.companyName || "-"}</span>
    </p>

    <p style="color:#666; font-size:12px; margin-top:14px;">
      Attached: Recruitment Letter PDF
    </p>
  </div>
  `.trim();

  return { subject, text, html };
};

// ✅ helper: generate PDF buffer in memory (same style as downloadMyLetterPdf)
const generateLetterPdfBuffer = (letter) =>
  new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });

      const stream = new PassThrough();
      const chunks = [];

      stream.on("data", (c) => chunks.push(c));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", reject);

      doc.pipe(stream);

      // Header
      doc.fontSize(18).text(letter.companyName || "Company");
      doc.moveDown(0.3);

      if (letter.companyAddress) doc.fontSize(10).fillColor("#444").text(letter.companyAddress);
      if (letter.companyPhone || letter.companyEmail) {
        doc
          .fontSize(10)
          .fillColor("#444")
          .text([letter.companyPhone, letter.companyEmail].filter(Boolean).join(" • "));
      }

      doc.moveDown(1);
      doc.fillColor("#000").fontSize(10);
      doc.text(`Ref: ${letter.letterRefNo || "-"}`);
      doc.text(`Date: ${letter.issueDate || "-"}`);

      doc.moveDown(1.2);
      doc.fontSize(14).text("RECRUITMENT LETTER", { align: "center" });

      doc.moveDown(1.2);
      doc.fontSize(11).text("To,");
      doc.fontSize(11).text(letter.candidateName || "Job Seeker");
      if (letter.candidateAddress) doc.fontSize(10).fillColor("#444").text(letter.candidateAddress);
      if (letter.candidateEmail) doc.fontSize(10).fillColor("#444").text(letter.candidateEmail);
      doc.fillColor("#000");

      doc.moveDown(1);
      doc.fontSize(11).text(`Subject: ${letter.subject || "Recruitment Letter"}`);

      doc.moveDown(1);
      doc.fontSize(11).text(`Dear ${letter.candidateName || "Job Seeker"},`);

      doc.moveDown(0.7);
      doc.fontSize(11).text(
        `We are pleased to offer you the position of ${letter.positionTitle || "-"}${
          letter.department ? ` in the ${letter.department} department` : ""
        } at ${letter.companyName || "our company"}.`
      );

      if (letter.employmentType || letter.workLocation) {
        doc.moveDown(0.7);
        doc.text(
          `Your employment will be on ${letter.employmentType || "-"} basis and your work arrangement will be ${
            letter.workLocation || "-"
          }.`
        );
      }

      doc.moveDown(0.8);
      doc.fontSize(11).text("Offer Details:");

      const bullets = [];
      if (letter.startDate) bullets.push(`Start Date: ${letter.startDate}`);
      if (letter.salaryAmount || letter.salaryFrequency)
        bullets.push(
          `Salary: ${letter.salaryAmount || "-"}${letter.salaryFrequency ? ` (${letter.salaryFrequency})` : ""}`
        );
      if (letter.probationPeriod) bullets.push(`Probation Period: ${letter.probationPeriod}`);
      if (letter.workingHours) bullets.push(`Working Hours: ${letter.workingHours}`);
      if (letter.reportingTo) bullets.push(`Reporting To: ${letter.reportingTo}`);
      if (letter.officeAddress) bullets.push(`Office Address: ${letter.officeAddress}`);

      doc.moveDown(0.4);
      doc.fontSize(10);
      bullets.forEach((b) => doc.text(`• ${b}`));

      if (letter.extraTerms) {
        doc.moveDown(0.8);
        doc.fontSize(10).text(letter.extraTerms);
      }

      doc.moveDown(1);
      doc.fontSize(11).text("We look forward to welcoming you to our team.");

      doc.moveDown(1.5);
      doc.fontSize(11).text("Sincerely,");
      doc.moveDown(1);
      doc.fontSize(11).text(letter.hrName || "-");
      doc.fontSize(10).fillColor("#444").text(letter.hrTitle || "-");
      doc.fontSize(10).fillColor("#444").text(letter.companyName || "-");
      doc.fillColor("#000");

      // Signature line (blank)
      doc.moveDown(2);
      doc.text("______________________________", { align: "right" });
      doc.fontSize(9).fillColor("#444").text("Signature", { align: "right" });

      doc.end();
    } catch (e) {
      reject(e);
    }
  });

// -------------------------------------------
// Admin: list jobseekers
// GET /api/admin/jobseekers?search=abc
// -------------------------------------------
exports.listJobSeekers = async (req, res) => {
  if (!ensureRole("admin")(req, res)) return;

  try {
    const search = String(req.query.search || "").trim();
    const q = { role: "jobseeker" };

    if (search) {
      q.$or = [
        { name: { $regex: search, $options: "i" } },
        { fullName: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(q).sort({ createdAt: -1 }).limit(50);
    return res.json(users.map(pickJobSeeker));
  } catch (err) {
    console.error("listJobSeekers error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// -------------------------------------------
// Admin: create draft
// POST /api/admin/recruitment-letters
// -------------------------------------------
exports.createLetter = async (req, res) => {
  if (!ensureRole("admin")(req, res)) return;

  try {
    const body = req.body || {};

    const required = [
      "jobSeekerId",
      "companyName",
      "letterRefNo",
      "issueDate",
      "candidateName",
      "positionTitle",
      "hrName",
      "hrTitle",
    ];

    for (const k of required) {
      if (!String(body?.[k] || "").trim()) {
        return res.status(400).json({ message: `${k} is required` });
      }
    }

    const js = await User.findById(body.jobSeekerId);
    if (!js) return res.status(400).json({ message: "JobSeeker not found" });
    if (js.role !== "jobseeker") {
      return res.status(400).json({ message: "Receiver must be jobseeker" });
    }

    const letter = await RecruitmentLetter.create({
      ...body,
      status: "draft",
      publishedAt: null,
    });

    return res.status(201).json(letter);
  } catch (err) {
    console.error("createLetter error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// -------------------------------------------
// Admin: update
// PUT /api/admin/recruitment-letters/:id
// -------------------------------------------
exports.updateLetter = async (req, res) => {
  if (!ensureRole("admin")(req, res)) return;

  try {
    const { id } = req.params;
    const body = req.body || {};

    const letter = await RecruitmentLetter.findById(id);
    if (!letter) return res.status(404).json({ message: "Letter not found" });

    if (body.jobSeekerId && String(body.jobSeekerId) !== String(letter.jobSeekerId)) {
      const js = await User.findById(body.jobSeekerId);
      if (!js) return res.status(400).json({ message: "JobSeeker not found" });
      if (js.role !== "jobseeker") {
        return res.status(400).json({ message: "Receiver must be jobseeker" });
      }
    }

    Object.assign(letter, body);
    await letter.save();

    return res.json(letter);
  } catch (err) {
    console.error("updateLetter error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// -------------------------------------------
// Admin: list letters
// GET /api/admin/recruitment-letters?status=draft|published&jobSeekerId=...
// -------------------------------------------
exports.listLettersAdmin = async (req, res) => {
  if (!ensureRole("admin")(req, res)) return;

  try {
    const { status, jobSeekerId } = req.query;

    const q = {};
    if (status) q.status = status;
    if (jobSeekerId) q.jobSeekerId = jobSeekerId;

    const letters = await RecruitmentLetter.find(q).sort({ createdAt: -1 });
    return res.json(letters);
  } catch (err) {
    console.error("listLettersAdmin error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// -------------------------------------------
// Admin: get one
// GET /api/admin/recruitment-letters/:id
// -------------------------------------------
exports.getLetterAdmin = async (req, res) => {
  if (!ensureRole("admin")(req, res)) return;

  try {
    const { id } = req.params;
    const letter = await RecruitmentLetter.findById(id);
    if (!letter) return res.status(404).json({ message: "Letter not found" });
    return res.json(letter);
  } catch (err) {
    console.error("getLetterAdmin error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// -------------------------------------------
// Admin: publish (UPDATED: publish + email + PDF attachment)
// POST /api/admin/recruitment-letters/:id/publish
// -------------------------------------------
exports.publishLetter = async (req, res) => {
  if (!ensureRole("admin")(req, res)) return;

  try {
    const { id } = req.params;

    const letter = await RecruitmentLetter.findById(id);
    if (!letter) return res.status(404).json({ message: "Letter not found" });

    // ✅ publish
    letter.status = "published";
    letter.publishedAt = new Date();
    await letter.save();

    // ✅ receiver email
    let toEmail = String(letter.candidateEmail || "").trim();
    if (!toEmail && letter.jobSeekerId) {
      const js = await User.findById(letter.jobSeekerId).select("email").lean();
      toEmail = String(js?.email || "").trim();
    }

    // ✅ email result for response
    const emailResult = {
      attempted: false,
      sent: false,
      to: toEmail || "",
      messageId: "",
      error: "",
      attachment: false,
    };

    // ✅ try send email (publish will remain even if email fails)
    if (toEmail) {
      emailResult.attempted = true;

      try {
        const pdfBuffer = await generateLetterPdfBuffer(letter);

        const safeName = (letter.candidateName || "JobSeeker")
          .replace(/[^\w\s.-]/g, "")
          .trim()
          .replace(/\s+/g, "_");

        const filename = `Recruitment_Letter_${safeName}_${letter._id}.pdf`;

        const { subject, text, html } = buildLetterEmail(letter);

        const info = await transporter.sendMail({
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: toEmail,
          subject,
          text,
          html,
          attachments: [
            {
              filename,
              content: pdfBuffer,
              contentType: "application/pdf",
            },
          ],
        });

        emailResult.sent = true;
        emailResult.messageId = info?.messageId || "";
        emailResult.attachment = true;
      } catch (mailErr) {
        emailResult.sent = false;
        emailResult.error = mailErr?.message || "Failed to send email";
        console.error("Recruitment letter email error:", mailErr);
      }
    } else {
      emailResult.error = "JobSeeker email not found (candidateEmail/user.email empty)";
    }

    return res.json({ message: "Published", letter, email: emailResult });
  } catch (err) {
    console.error("publishLetter error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// -------------------------------------------
// JobSeeker: get my latest published
// GET /api/recruitment-letters/me
// -------------------------------------------
exports.getMyLatestPublishedLetter = async (req, res) => {
  if (!ensureRole("jobseeker")(req, res)) return;

  try {
    const jobSeekerId = req.user.id;

    const letter = await RecruitmentLetter.findOne({
      jobSeekerId,
      status: "published",
    }).sort({ publishedAt: -1, createdAt: -1 });

    return res.json(letter || null);
  } catch (err) {
    console.error("getMyLatestPublishedLetter error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// -------------------------------------------
// JobSeeker: download my published letter as PDF
// GET /api/recruitment-letters/:id/pdf
// -------------------------------------------
exports.downloadMyLetterPdf = async (req, res) => {
  if (!ensureRole("jobseeker")(req, res)) return;

  try {
    const { id } = req.params;
    const jobSeekerId = String(req.user.id);

    const letter = await RecruitmentLetter.findById(id);
    if (!letter) return res.status(404).json({ message: "Letter not found" });

    if (letter.status !== "published") {
      return res.status(403).json({ message: "Letter not published yet" });
    }

    if (String(letter.jobSeekerId) !== jobSeekerId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // ---- Create PDF ----
    const safeName = (letter.candidateName || "JobSeeker")
      .replace(/[^\w\s.-]/g, "")
      .trim()
      .replace(/\s+/g, "_");

    const filename = `Recruitment_Letter_${safeName}_${letter._id}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    const doc = new PDFDocument({ size: "A4", margin: 50 });

    doc.pipe(res);

    // Header
    doc.fontSize(18).text(letter.companyName || "Company");
    doc.moveDown(0.3);

    if (letter.companyAddress) doc.fontSize(10).fillColor("#444").text(letter.companyAddress);
    if (letter.companyPhone || letter.companyEmail) {
      doc
        .fontSize(10)
        .fillColor("#444")
        .text([letter.companyPhone, letter.companyEmail].filter(Boolean).join(" • "));
    }

    doc.moveDown(1);
    doc.fillColor("#000").fontSize(10);
    doc.text(`Ref: ${letter.letterRefNo || "-"}`);
    doc.text(`Date: ${letter.issueDate || "-"}`);

    doc.moveDown(1.2);
    doc.fontSize(14).text("RECRUITMENT LETTER", { align: "center" });

    doc.moveDown(1.2);
    doc.fontSize(11).text("To,");
    doc.fontSize(11).text(letter.candidateName || "Job Seeker");
    if (letter.candidateAddress) doc.fontSize(10).fillColor("#444").text(letter.candidateAddress);
    if (letter.candidateEmail) doc.fontSize(10).fillColor("#444").text(letter.candidateEmail);
    doc.fillColor("#000");

    doc.moveDown(1);
    doc.fontSize(11).text(`Subject: ${letter.subject || "Recruitment Letter"}`);

    doc.moveDown(1);
    doc.fontSize(11).text(`Dear ${letter.candidateName || "Job Seeker"},`);

    doc.moveDown(0.7);
    doc.fontSize(11).text(
      `We are pleased to offer you the position of ${letter.positionTitle || "-"}${
        letter.department ? ` in the ${letter.department} department` : ""
      } at ${letter.companyName || "our company"}.`
    );

    if (letter.employmentType || letter.workLocation) {
      doc.moveDown(0.7);
      doc.text(
        `Your employment will be on ${letter.employmentType || "-"} basis and your work arrangement will be ${
          letter.workLocation || "-"
        }.`
      );
    }

    doc.moveDown(0.8);
    doc.fontSize(11).text("Offer Details:");

    const bullets = [];
    if (letter.startDate) bullets.push(`Start Date: ${letter.startDate}`);
    if (letter.salaryAmount || letter.salaryFrequency)
      bullets.push(
        `Salary: ${letter.salaryAmount || "-"}${letter.salaryFrequency ? ` (${letter.salaryFrequency})` : ""}`
      );
    if (letter.probationPeriod) bullets.push(`Probation Period: ${letter.probationPeriod}`);
    if (letter.workingHours) bullets.push(`Working Hours: ${letter.workingHours}`);
    if (letter.reportingTo) bullets.push(`Reporting To: ${letter.reportingTo}`);
    if (letter.officeAddress) bullets.push(`Office Address: ${letter.officeAddress}`);

    doc.moveDown(0.4);
    doc.fontSize(10);
    bullets.forEach((b) => doc.text(`• ${b}`));

    if (letter.extraTerms) {
      doc.moveDown(0.8);
      doc.fontSize(10).text(letter.extraTerms);
    }

    doc.moveDown(1);
    doc.fontSize(11).text("We look forward to welcoming you to our team.");

    doc.moveDown(1.5);
    doc.fontSize(11).text("Sincerely,");
    doc.moveDown(1);
    doc.fontSize(11).text(letter.hrName || "-");
    doc.fontSize(10).fillColor("#444").text(letter.hrTitle || "-");
    doc.fontSize(10).fillColor("#444").text(letter.companyName || "-");
    doc.fillColor("#000");

    // Signature line (blank)
    doc.moveDown(2);
    doc.text("______________________________", { align: "right" });
    doc.fontSize(9).fillColor("#444").text("Signature", { align: "right" });

    doc.end();
  } catch (err) {
    console.error("downloadMyLetterPdf error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

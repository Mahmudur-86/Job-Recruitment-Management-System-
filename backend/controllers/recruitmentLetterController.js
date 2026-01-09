const RecruitmentLetter = require("../models/RecruitmentLetter");
const User = require("../models/User");
const PDFDocument = require("pdfkit");

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
// Admin: publish
// POST /api/admin/recruitment-letters/:id/publish
// -------------------------------------------
exports.publishLetter = async (req, res) => {
  if (!ensureRole("admin")(req, res)) return;

  try {
    const { id } = req.params;

    const letter = await RecruitmentLetter.findById(id);
    if (!letter) return res.status(404).json({ message: "Letter not found" });

    letter.status = "published";
    letter.publishedAt = new Date();
    await letter.save();

    return res.json({ message: "Published", letter });
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
    doc.fontSize(18).text(letter.companyName || "Company", { bold: true });
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
    doc.fontSize(11).text(letter.candidateName || "Job Seeker", { underline: false });
    if (letter.candidateAddress) doc.fontSize(10).fillColor("#444").text(letter.candidateAddress);
    if (letter.candidateEmail) doc.fontSize(10).fillColor("#444").text(letter.candidateEmail);
    doc.fillColor("#000");

    doc.moveDown(1);
    doc.fontSize(11).text(`Subject: ${letter.subject || "Recruitment Letter"}`, { underline: false });

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
    doc.fontSize(11).text("Offer Details:", { underline: false });

    const bullets = [];
    if (letter.startDate) bullets.push(`Start Date: ${letter.startDate}`);
    if (letter.salaryAmount || letter.salaryFrequency)
      bullets.push(`Salary: ${letter.salaryAmount || "-"}${letter.salaryFrequency ? ` (${letter.salaryFrequency})` : ""}`);
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

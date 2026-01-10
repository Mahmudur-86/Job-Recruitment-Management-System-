// backend/controllers/adminReportController.js
const PDFDocument = require("pdfkit");
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const InterviewSubmission = require("../models/InterviewSubmission");
const RecruitmentLetter = require("../models/RecruitmentLetter"); // ✅ NEW (Recruitment Letter-based report)

// Admin guard
const ensureAdmin = (req, res) => {
  if (req.user?.role !== "admin") {
    res.status(403).json({ message: "Admin only" });
    return false;
  }
  return true;
};

// Month
const monthName = (m) =>
  [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ][m - 1] || "";

const getMonthRange = (month, year) => {
  const m = Number(month);
  const y = Number(year);
  if (!m || !y || m < 1 || m > 12 || y < 1970 || y > 3000) return null;
  const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
  const end = new Date(Date.UTC(y, m, 1, 0, 0, 0));
  return { start, end };
};

// Range
const isValidYMD = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s || "").trim());
const parseYMD_UTCStart = (ymd) => {
  const clean = String(ymd || "").trim();
  const [yy, mm, dd] = clean.split("-").map(Number);
  return new Date(Date.UTC(yy, mm - 1, dd, 0, 0, 0));
};

const getDateRange = (startDate, endDate) => {
  const s = String(startDate || "").trim();
  const e = String(endDate || "").trim();
  if (!isValidYMD(s) || !isValidYMD(e)) return null;

  const start = parseYMD_UTCStart(s);
  const endInclusiveStart = parseYMD_UTCStart(e);
  if (isNaN(start.getTime()) || isNaN(endInclusiveStart.getTime())) return null;
  if (start > endInclusiveStart) return null;

  const endExclusive = new Date(endInclusiveStart.getTime() + 24 * 60 * 60 * 1000);
  return { start, end: endExclusive, s, e };
};

const rangeLabel = (s, e) => `Range: ${String(s || "").trim()} to ${String(e || "").trim()}`;

// fetch + aggregate once for ANY range
const buildDetailsForRange = async ({ start, end, label }) => {
  // applications aggregated by jobId
  const appAgg = await Application.aggregate([
    { $match: { createdAt: { $gte: start, $lt: end } } },
    {
      $group: {
        _id: "$jobId",
        totalCV: { $sum: 1 },
        pending: { $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] } },
        approved: { $sum: { $cond: [{ $eq: ["$status", "Approved"] }, 1, 0] } },
        rejected: { $sum: { $cond: [{ $eq: ["$status", "Rejected"] }, 1, 0] } },
      },
    },
    { $sort: { totalCV: -1 } },
  ]);

  const jobIds = appAgg.map((x) => x._id);

  const jobs = await Job.find({ _id: { $in: jobIds } })
    .select("_id jobTitle title")
    .lean();

  const jobTitleMap = new Map();
  jobs.forEach((j) =>
    jobTitleMap.set(String(j._id), j.jobTitle || j.title || "Unknown Position")
  );

  // interview sent count (range)
  const sentAgg = await Application.aggregate([
    { $match: { interviewSent: true, interviewSentAt: { $gte: start, $lt: end } } },
    { $group: { _id: "$jobId", sent: { $sum: 1 } } },
  ]);
  const sentMap = new Map(sentAgg.map((x) => [String(x._id), x.sent]));

  // interview submission count (range)
  const subAgg = await InterviewSubmission.aggregate([
    { $match: { createdAt: { $gte: start, $lt: end } } },
    {
      $lookup: {
        from: "applications",
        localField: "applicationId",
        foreignField: "_id",
        as: "app",
      },
    },
    { $unwind: "$app" },
    { $group: { _id: "$app.jobId", submitted: { $sum: 1 } } },
  ]);
  const submittedMap = new Map(subAgg.map((x) => [String(x._id), x.submitted]));
  const rlAgg = await RecruitmentLetter.aggregate([
    {
      $match: {
        status: "published",
        publishedAt: { $gte: start, $lt: end },
      },
    },
    { $sort: { publishedAt: -1 } },
    {
      $group: {
        _id: "$positionTitle", 
        sentCount: { $sum: 1 },
        recipients: {
          $push: {
            to: "$candidateEmail",
            lastSentAt: "$publishedAt",
          },
        },
      },
    },
  ]);

  const rlMap = new Map(
    rlAgg.map((x) => [
      String(x._id || "").trim(),
      {
        sentCount: x.sentCount || 0,
        recipients: Array.isArray(x.recipients) ? x.recipients : [],
      },
    ])
  );
  const details = appAgg.map((row) => {
    const id = String(row._id);
    const sent = sentMap.get(id) || 0;
    const submitted = submittedMap.get(id) || 0;
    const position = jobTitleMap.get(id) || "Unknown Position";
    const rlInfo = rlMap.get(String(position).trim()) || { sentCount: 0, recipients: [] };
    const recipientsSorted = [...rlInfo.recipients].sort((a, b) => {
      const ta = a?.lastSentAt ? new Date(a.lastSentAt).getTime() : 0;
      const tb = b?.lastSentAt ? new Date(b.lastSentAt).getTime() : 0;
      return tb - ta;
    });

    const maxShow = 8;
    const shown = recipientsSorted.slice(0, maxShow);

    const toWithTime = shown
      .map((r) => {
        const mail = String(r?.to || "").trim();
        const t = r?.lastSentAt ? new Date(r.lastSentAt).toLocaleString() : "";
        return t ? `${mail} (${t})` : mail || "";
      })
      .filter(Boolean)
      .join(", ");

    const extraCount = recipientsSorted.length - shown.length;
    const rlToText = extraCount > 0 ? `${toWithTime} +${extraCount} more` : toWithTime;
    const rlStatus = rlInfo.sentCount > 0 ? "Sent" : "Not Sent";

    return {
      month: label,
      position,
      jobId: id,
      totalCV: row.totalCV || 0,
      pending: row.pending || 0,
      approved: row.approved || 0,
      rejected: row.rejected || 0,
      interviewSent: sent,
      interviewSubmitted: submitted,
      interviewPending: Math.max(0, sent - submitted),
      recruitmentLetterStatus: rlStatus,
      emailStatus: rlStatus,
      emailTo: rlToText || "",
    };
  });

  return details;
};

const buildSummaryForRange = async ({ start, end }) => {
  const [
    totalUsers,
    totalJobs,
    totalApplications,
    pendingApps,
    approvedApps,
    rejectedApps,
    interviewsSent,
    interviewsSubmitted,
    recruitmentLettersSent, 
  ] = await Promise.all([
    User.countDocuments({
      role: { $in: ["jobseeker", "Jobseeker", "JOBSEEKER"] },
      createdAt: { $gte: start, $lt: end },
    }),
    Job.countDocuments({ createdAt: { $gte: start, $lt: end } }),
    Application.countDocuments({ createdAt: { $gte: start, $lt: end } }),
    Application.countDocuments({ status: "Pending", createdAt: { $gte: start, $lt: end } }),
    Application.countDocuments({ status: "Approved", createdAt: { $gte: start, $lt: end } }),
    Application.countDocuments({ status: "Rejected", createdAt: { $gte: start, $lt: end } }),
    Application.countDocuments({ interviewSent: true, interviewSentAt: { $gte: start, $lt: end } }),
    InterviewSubmission.countDocuments({ createdAt: { $gte: start, $lt: end } }),

    
    RecruitmentLetter.countDocuments({
      status: "published",
      publishedAt: { $gte: start, $lt: end },
    }),
  ]);

  return {
    totalUsers,
    totalJobs,
    totalApplications,
    totalPendingApplications: pendingApps,
    totalApprovedApplications: approvedApps,
    totalRejectedApplications: rejectedApps,
    interviewsSent,
    interviewsSubmitted,
    interviewsPending: Math.max(0, interviewsSent - interviewsSubmitted),

    // keep the same field name so frontend doesn't break
    emailsSent: recruitmentLettersSent,
  };
};

// PDF
const scaleWidthsToFit = (doc, baseWidths) => {
  const pageW = doc.page.width;
  const left = doc.page.margins.left;
  const right = doc.page.margins.right;
  const usableW = pageW - left - right;
  const sum = baseWidths.reduce((a, b) => a + b, 0);
  if (sum <= usableW) return baseWidths;

  const scale = usableW / sum;
  const scaled = baseWidths.map((w) => Math.max(45, Math.floor(w * scale)));
  const scaledSum = scaled.reduce((a, b) => a + b, 0);
  const diff = usableW - scaledSum;
  scaled[scaled.length - 1] = scaled[scaled.length - 1] + diff;
  return scaled;
};

const drawRow = (doc, y, cols, widths, opts = {}) => {
  const {
    fill = null,
    textColor = "black",
    bold = false,
    height = 20,
    padding = 5,
    borderColor = "gray",
    fontSize = 8,
  } = opts;

  let x = doc.page.margins.left;
  const rowW = widths.reduce((a, b) => a + b, 0);

  if (fill) {
    doc.save();
    doc.fillColor(fill).rect(x, y, rowW, height).fill();
    doc.restore();
  }

  doc.font(bold ? "Times-Bold" : "Times-Roman").fillColor(textColor).fontSize(fontSize);

  for (let i = 0; i < cols.length; i++) {
    const w = widths[i];
    doc.save();
    doc.strokeColor(borderColor).rect(x, y, w, height).stroke();
    doc.restore();

    doc.text(String(cols[i] ?? ""), x + padding, y + 5, {
      width: w - padding * 2,
      align: i === 1 ? "left" : "center",
      lineBreak: false,
      ellipsis: true,
    });

    x += w;
  }

  return y + height;
};

const safeShortId = (id) => String(id).slice(-6);
const safeShortText = (s, max = 28) => {
  const str = String(s || "");
  if (str.length <= max) return str;
  return str.slice(0, max - 3) + "...";
};

const renderReportPdf = ({
  res,
  fileName,
  companyName = "EconoTech",
  generatedLabel,
  headerFirstCol,
  firstColValueForRow,
  details,
  totalsRow,
}) => {
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);

  const doc = new PDFDocument({ margin: 28, size: "A3", layout: "landscape" });
  doc.pipe(res);

  doc.font("Times-Bold").fontSize(16).text("Job Recruitment Management System Report", { align: "center" });
  doc.moveDown(0.15);
  doc.font("Times-Roman").fontSize(10).text(`Company Name: ${companyName}`, { align: "center" });
  doc.moveDown(0.15);
  doc.font("Times-Roman").fontSize(9).fillColor("gray").text(`${generatedLabel}`, { align: "center" });
  doc.fillColor("black");
  doc.moveDown(0.6);

  
  const baseWidths = [
    110, 190, 85, 65, 65, 65, 65, 75, 125, 75,
    110, 80, 300
  ];
  const widths = scaleWidthsToFit(doc, baseWidths);

  const header = [
    headerFirstCol,
    "Position",
    "Job ID",
    "Total CV",
    "Pending",
    "Approved",
    "Rejected",
    "Interview Sent",
    "Interview Submitted",
    "Interview Pending",
    "Recruitment Letter",
    "Email Status",
    "Email To (with time)",
  ];

  let y = doc.y;

  const drawHeader = () => {
    y = drawRow(doc, y, header, widths, {
      fill: "gray",
      textColor: "white",
      bold: true,
      height: 22,
      fontSize: 8,
    });
  };

  drawHeader();

  const rowH = 20;
  const bottomSafe = doc.page.height - doc.page.margins.bottom - 24;

  for (const r of details) {
    if (y + rowH > bottomSafe) {
      doc.addPage({ size: "A3", layout: "landscape", margin: 28 });
      y = doc.y;
      drawHeader();
    }

    y = drawRow(
      doc,
      y,
      [
        firstColValueForRow(r),
        safeShortText(r.position, 34),
        safeShortId(r.jobId),
        r.totalCV,
        r.pending,
        r.approved,
        r.rejected,
        r.interviewSent,
        r.interviewSubmitted,
        r.interviewPending,
        r.recruitmentLetterStatus || "Not Sent",
        r.emailStatus || "Not Sent",
        safeShortText(r.emailTo, 90),
      ],
      widths,
      { height: rowH, fontSize: 8 }
    );
  }

  if (y + 22 > bottomSafe) {
    doc.addPage({ size: "A3", layout: "landscape", margin: 28 });
    y = doc.y;
    drawHeader();
  }

  y = drawRow(doc, y, totalsRow, widths, {
    fill: "lightgray",
    bold: true,
    height: 22,
    fontSize: 8,
  });

  doc.end();
};

// MONTHLY JSON
exports.getMonthlyReport = async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  const { month, year } = req.query;
  const range = getMonthRange(month, year);
  if (!range) return res.status(400).json({ message: "Invalid month/year" });

  const { start, end } = range;
  const label = `${monthName(Number(month))} ${year}`;

  try {
    const [summary, details] = await Promise.all([
      buildSummaryForRange({ start, end }),
      buildDetailsForRange({ start, end, label }),
    ]);

    return res.json({
      companyName: "EconoTech",
      month: label,
      range: { start: start.toISOString(), end: end.toISOString() },
      monthlySummary: summary,
      details,
    });
  } catch (err) {
    console.error("MONTHLY REPORT ERROR:", err);
    return res.status(500).json({ message: "Failed to generate report" });
  }
};

// MONTHLY PDF
exports.downloadMonthlyReportPdf = async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  const { month, year } = req.query;
  const range = getMonthRange(month, year);
  if (!range) return res.status(400).json({ message: "Invalid month/year" });

  const { start, end } = range;
  const label = `${monthName(Number(month))} ${year}`;

  try {
    const [summary, details] = await Promise.all([
      buildSummaryForRange({ start, end }),
      buildDetailsForRange({ start, end, label }),
    ]);

    const fileName = `Monthly_Report_${year}_${String(month).padStart(2, "0")}.pdf`;
    const generatedLabel = `Month: ${label}  |  Generated: ${new Date().toLocaleString()}`;

    renderReportPdf({
      res,
      fileName,
      generatedLabel,
      headerFirstCol: "Month",
      firstColValueForRow: (r) => r.month,
      details,
      totalsRow: [
        "TOTAL",
        "-",
        "-",
        summary.totalApplications,
        summary.totalPendingApplications,
        summary.totalApprovedApplications,
        summary.totalRejectedApplications,
        summary.interviewsSent,
        summary.interviewsSubmitted,
        summary.interviewsPending,
        "-", // Recruitment Letter
        "-", // Email Status
        "-", // Email To
      ],
    });
  } catch (err) {
    console.error("MONTHLY PDF ERROR:", err);
    return res.status(500).json({ message: "Failed to generate PDF" });
  }
};

// RANGE JSON
exports.getRangeReport = async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  const { startDate, endDate } = req.query;
  const range = getDateRange(startDate, endDate);
  if (!range) return res.status(400).json({ message: "Invalid startDate/endDate (use YYYY-MM-DD)" });

  const { start, end, s, e } = range;
  const label = rangeLabel(s, e);

  try {
    const [summary, details] = await Promise.all([
      buildSummaryForRange({ start, end }),
      buildDetailsForRange({ start, end, label }),
    ]);

    return res.json({
      companyName: "EconoTech",
      rangeLabel: label,
      range: { start: start.toISOString(), end: end.toISOString() },
      rangeSummary: summary,
      details,
    });
  } catch (err) {
    console.error("RANGE REPORT ERROR:", err);
    return res.status(500).json({ message: "Failed to generate report" });
  }
};

// RANGE PDF
exports.downloadRangeReportPdf = async (req, res) => {
  if (!ensureAdmin(req, res)) return;

  const { startDate, endDate } = req.query;
  const range = getDateRange(startDate, endDate);
  if (!range) return res.status(400).json({ message: "Invalid startDate/endDate (use YYYY-MM-DD)" });

  const { start, end, s, e } = range;
  const label = rangeLabel(s, e);

  try {
    const [summary, details] = await Promise.all([
      buildSummaryForRange({ start, end }),
      buildDetailsForRange({ start, end, label }),
    ]);

    const fileName = `Range_Report_${s}_to_${e}.pdf`;
    const generatedLabel = `${label}  |  Generated: ${new Date().toLocaleString()}`;

    renderReportPdf({
      res,
      fileName,
      generatedLabel,
      headerFirstCol: "Range",
      firstColValueForRow: (r) => r.month,
      details,
      totalsRow: [
        "TOTAL",
        "-",
        "-",
        summary.totalApplications,
        summary.totalPendingApplications,
        summary.totalApprovedApplications,
        summary.totalRejectedApplications,
        summary.interviewsSent,
        summary.interviewsSubmitted,
        summary.interviewsPending,
        "-", // Recruitment Letter
        "-", // Email Status
        "-", // Email To
      ],
    });
  } catch (err) {
    console.error("RANGE PDF ERROR:", err);
    return res.status(500).json({ message: "Failed to generate PDF" });
  }
};

// controllers/adminJobController.js
const Job = require("../models/Job");

const ensureAdmin = (req, res) => {
  if (req.user?.role !== "admin") {
    res.status(403).json({ message: "Admin only" });
    return false;
  }
  return true;
};

// GET /api/admin/jobs  (admin) ✅ includes mcqs
exports.getAdminJobs = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;
    const jobs = await Job.find().sort({ createdAt: -1 });
    return res.json({ jobs });
  } catch (err) {
    console.log("ADMIN GET JOBS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// POST /api/admin/jobs
exports.createJob = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const {
      title,
      company,
      location,
      category,
      salary,
      description,
      requirements,
      vacancies,
    } = req.body || {};

    const required = [
      "title",
      "company",
      "location",
      "category",
      "salary",
      "description",
      "requirements",
      "vacancies",
    ];

    for (const k of required) {
      if (!String(req.body?.[k] ?? "").trim()) {
        return res.status(400).json({ message: `${k} is required` });
      }
    }

    const job = await Job.create({
      title: String(title).trim(),
      company: String(company).trim(),
      location: String(location).trim(),
      category: String(category).trim(),
      salary: String(salary).trim(),
      description: String(description).trim(),
      requirements: String(requirements).trim(),
      vacancies: Number(vacancies) || 0,
      mcqs: [],
    });

    return res.status(201).json({ message: "Job created", job });
  } catch (err) {
    console.log("ADMIN CREATE JOB ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ NEW: PUT /api/admin/jobs/:id  (edit job)
exports.updateJob = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const {
      title,
      company,
      location,
      category,
      salary,
      description,
      requirements,
      vacancies,
    } = req.body || {};

    // Only update allowed fields (and require non-empty if provided)
    const allowed = {
      title,
      company,
      location,
      category,
      salary,
      description,
      requirements,
      vacancies,
    };

    const update = {};
    for (const key in allowed) {
      if (allowed[key] !== undefined) {
        // if user sends empty string -> reject
        if (!String(allowed[key]).trim()) {
          return res.status(400).json({ message: `${key} is required` });
        }

        update[key] =
          key === "vacancies"
            ? Number(allowed[key]) || 0
            : String(allowed[key]).trim();
      }
    }

    const job = await Job.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!job) return res.status(404).json({ message: "Job not found" });

    return res.json({ message: "Job updated", job });
  } catch (err) {
    console.log("ADMIN UPDATE JOB ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/admin/jobs/:id
exports.deleteJob = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const deleted = await Job.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Job not found" });

    return res.json({ message: "Job deleted" });
  } catch (err) {
    console.log("ADMIN DELETE JOB ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/admin/jobs/:id/mcqs  (3 mcq only)
exports.saveJobMcqs = async (req, res) => {
  try {
    if (!ensureAdmin(req, res)) return;

    const { mcqs } = req.body || {};
    if (!Array.isArray(mcqs) || mcqs.length !== 3) {
      return res
        .status(400)
        .json({ message: "mcqs must be an array of 3 questions" });
    }

    for (let i = 0; i < mcqs.length; i++) {
      const q = mcqs[i];
      if (!String(q?.question ?? "").trim()) {
        return res
          .status(400)
          .json({ message: `MCQ ${i + 1} question is required` });
      }
      if (!Array.isArray(q?.options) || q.options.length !== 4) {
        return res
          .status(400)
          .json({ message: `MCQ ${i + 1} must have 4 options` });
      }
      for (let j = 0; j < 4; j++) {
        if (!String(q.options[j] ?? "").trim()) {
          return res
            .status(400)
            .json({ message: `MCQ ${i + 1} option ${j + 1} is required` });
        }
      }
      const c = Number(q.correctOption);
      if (Number.isNaN(c) || c < 0 || c > 3) {
        return res
          .status(400)
          .json({ message: `MCQ ${i + 1} correct option invalid` });
      }
    }

    const updated = await Job.findByIdAndUpdate(
      req.params.id,
      {
        mcqs: mcqs.map((x) => ({
          question: String(x.question).trim(),
          options: x.options.map((o) => String(o)),
          correctOption: Number(x.correctOption),
        })),
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Job not found" });

    return res.json({ message: "Interview questions saved", job: updated });
  } catch (err) {
    console.log("ADMIN SAVE MCQS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

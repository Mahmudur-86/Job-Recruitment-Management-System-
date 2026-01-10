const Job = require("../models/Job");
// GET /api/jobs?q=developer&page=1&limit=9
exports.getPublicJobs = async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(50, Math.max(1, Number(req.query.limit || 9)));
    const skip = (page - 1) * limit;

    const filter = {};
    if (q) {
      const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const rx = new RegExp(safe, "i");
      filter.$or = [
        { title: rx },
        { company: rx },
        { location: rx },
        { category: rx },
      ];
    }
    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .select("-mcqs") 
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Job.countDocuments(filter),
    ]);

    return res.json({ success: true, page, limit, total, jobs });
  } catch (e) {
    console.error("PUBLIC JOBS ERROR:", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

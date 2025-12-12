const Application = require("../models/Application");

const ensureAdmin = (req, res) => {
  if (req.user?.role !== "admin") {
    res.status(403).json({ message: "Admin only" });
    return false;
  }
  return true;
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

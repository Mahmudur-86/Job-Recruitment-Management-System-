const JobApplication = require("../models/JobApplication");
const Notification = require("../models/Notification");

// USER APPLY
exports.submitApplication = async (req, res) => {
  try {
    const data = req.body;

    const application = await JobApplication.create({
      user: req.user.id,
      ...data
    });

    await Notification.create({
      user: req.user.id,
      message: `You applied for ${data.jobTitle} at ${data.company}.`,
      date: new Date().toLocaleDateString(),
      notifyType: "job",
    });

    res.json({ application });
  } catch (err) {
    res.status(500).json({ message: "Submit failed" });
  }
};

// USER APPLICATION LIST
exports.getMyApplications = async (req, res) => {
  const list = await JobApplication.find({ user: req.user.id }).sort({
    createdAt: -1,
  });
  res.json(list);
};

// ADMIN SEE ALL APPLICANTS
exports.getAllApplications = async (req, res) => {
  const list = await JobApplication.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json({ applications: list });
};

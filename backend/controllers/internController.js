const InternRequest = require("../models/InternRequest");
const Notification = require("../models/Notification");

exports.submitInternRequest = async (req, res) => {
  const intern = await InternRequest.create({
    user: req.user.id,
    ...req.body
  });

  await Notification.create({
    user: req.user.id,
    message: "Your internship request has been submitted.",
    date: new Date().toLocaleDateString(),
    notifyType: "intern",
  });

  res.json(intern);
};

exports.getMyInternRequests = async (req, res) => {
  const list = await InternRequest.find({ user: req.user.id })
    .sort({ createdAt: -1 });

  res.json(list);
};

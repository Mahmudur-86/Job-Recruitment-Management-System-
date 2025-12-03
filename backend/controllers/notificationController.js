const Notification = require("../models/Notification");

exports.getMyNotifications = async (req, res) => {
  const list = await Notification.find({ user: req.user.id })
    .sort({ createdAt: -1 });

  res.json(list);
};

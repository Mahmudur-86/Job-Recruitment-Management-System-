const Notification = require("../models/Notification");

exports.getMyNotifications = async (req, res) => {
  try {
    const items = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    const unreadCount = items.filter((n) => !n.isRead).length;
    return res.json({ notifications: items, unreadCount });
  } catch (err) {
    console.log("GET MY NOTIFICATIONS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.markRead = async (req, res) => {
  try {
    const updated = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { isRead: true },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });
    return res.json({ message: "Marked as read", notification: updated });
  } catch (err) {
    console.log("MARK READ ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const deleted = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deleted) return res.status(404).json({ message: "Not found" });
    return res.json({ message: "Notification removed" });
  } catch (err) {
    console.log("DELETE NOTIFICATION ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

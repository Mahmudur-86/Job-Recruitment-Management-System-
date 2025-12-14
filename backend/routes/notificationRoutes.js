const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  getMyNotifications,
  markRead,
  deleteNotification,
} = require("../controllers/notificationsController");

router.use(auth);

router.get("/my", getMyNotifications);
router.patch("/:id/read", markRead);
router.delete("/:id", deleteNotification);

module.exports = router;

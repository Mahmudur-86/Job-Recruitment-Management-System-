const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { getMyNotifications } = require("../controllers/notificationController");

router.get("/me", auth, getMyNotifications);

module.exports = router;

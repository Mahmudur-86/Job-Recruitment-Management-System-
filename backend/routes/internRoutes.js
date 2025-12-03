const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  submitInternRequest,
  getMyInternRequests
} = require("../controllers/internController");

router.post("/", auth, submitInternRequest);
router.get("/me", auth, getMyInternRequests);

module.exports = router;

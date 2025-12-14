const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  getInterviewByApplication,
  submitInterview,
} = require("../controllers/interviewController");

router.use(auth);

router.get("/application/:applicationId", getInterviewByApplication);
router.post("/application/:applicationId/submit", submitInterview);

module.exports = router;

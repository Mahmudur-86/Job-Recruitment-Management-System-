const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  submitApplication,
  getMyApplications
} = require("../controllers/jobApplicationController");

router.post("/", auth, submitApplication);
router.get("/me", auth, getMyApplications);

module.exports = router;

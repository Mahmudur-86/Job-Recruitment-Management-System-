const router = require("express").Router();
const auth = require("../middleware/authMiddleware");

const {
  getInterviewByApplication,
  submitInterview,
  getSubmissionForEmployer,
  getEmployerApplications,
} = require("../controllers/interviewController");

router.use(auth);


// JobSeeker

router.get("/application/:applicationId", getInterviewByApplication);
router.post("/application/:applicationId/submit", submitInterview);


// Employer

router.get("/application/:applicationId/submission", getSubmissionForEmployer);
router.get("/employer/applications", getEmployerApplications);

module.exports = router;

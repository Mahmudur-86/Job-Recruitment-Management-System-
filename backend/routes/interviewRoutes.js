const router = require("express").Router();
const auth = require("../middleware/authMiddleware");

const {
  getInterviewByApplication,
  submitInterview,
    getAdminApplications,
  getSubmissionForAdmin,
} = require("../controllers/interviewController");

router.use(auth);


// JobSeeker

router.get("/application/:applicationId", getInterviewByApplication);
router.post("/application/:applicationId/submit", submitInterview);



// Admin 
router.get("/admin/applications", getAdminApplications);
router.get("/admin/application/:applicationId/submission", getSubmissionForAdmin);








module.exports = router;

const router = require("express").Router();
const auth = require("../middleware/authMiddleware");

const {
  createApplication,
  getMyApplications,
  deleteMyApplication,
} = require("../controllers/applicationController");

// protect all routes
router.use(auth);

// Jobseeker apply
router.post("/", createApplication);

// Jobseeker my applications
router.get("/my", getMyApplications);

//  Jobseeker remove job request
router.delete("/:id", deleteMyApplication);

module.exports = router;
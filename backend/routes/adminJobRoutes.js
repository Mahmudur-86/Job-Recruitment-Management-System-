// routes/adminJobRoutes.js
const router = require("express").Router();
const auth = require("../middleware/authMiddleware");

const {
  getAdminJobs,
  createJob,
  updateJob, 
  deleteJob,
  saveJobMcqs,
} = require("../controllers/adminJobController");

router.get("/jobs", auth, getAdminJobs);
router.post("/jobs", auth, createJob);

//  NEW: edit job
router.put("/jobs/:id", auth, updateJob);

router.delete("/jobs/:id", auth, deleteJob);
router.put("/jobs/:id/mcqs", auth, saveJobMcqs);

module.exports = router;

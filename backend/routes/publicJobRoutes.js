const router = require("express").Router();
const { getPublicJobs } = require("../controllers/publicJobController");

// public (no token)
router.get("/jobs", getPublicJobs);

module.exports = router;

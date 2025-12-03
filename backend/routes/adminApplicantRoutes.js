const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { getAllApplications } = require("../controllers/jobApplicationController");

router.use(auth);

router.get("/", getAllApplications);

module.exports = router;

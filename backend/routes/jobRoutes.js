const router = require("express").Router();
const { getAllJobs } = require("../controllers/jobController");

router.get("/", getAllJobs);

module.exports = router;
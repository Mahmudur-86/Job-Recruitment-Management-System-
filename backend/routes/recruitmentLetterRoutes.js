const express = require("express");
const router = express.Router();


const auth = require("../middleware/authMiddleware");

const ctrl = require("../controllers/recruitmentLetterController");

// Admin: jobseeker picker
router.get("/admin/jobseekers", auth, ctrl.listJobSeekers);

// Admin letter APIs
router.post("/admin/recruitment-letters", auth, ctrl.createLetter);
router.put("/admin/recruitment-letters/:id", auth, ctrl.updateLetter);
router.get("/admin/recruitment-letters", auth, ctrl.listLettersAdmin);
router.get("/admin/recruitment-letters/:id", auth, ctrl.getLetterAdmin);
router.post("/admin/recruitment-letters/:id/publish", auth, ctrl.publishLetter);

// JobSeeker
router.get("/recruitment-letters/me", auth, ctrl.getMyLatestPublishedLetter);

//   PDF download
router.get("/recruitment-letters/:id/pdf", auth, ctrl.downloadMyLetterPdf);

module.exports = router;

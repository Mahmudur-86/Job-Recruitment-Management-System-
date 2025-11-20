const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const auth = require("../middleware/authMiddleware");
const { getMyProfile, updateMyProfile } = require("../controllers/jobSeekerProfileController");

const router = express.Router();

// Ensure uploads/cv folder exists 
const cvFolder = path.join(__dirname, "..", "uploads", "cv");
if (!fs.existsSync(cvFolder)) {
  fs.mkdirSync(cvFolder, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    // Ensure folder exists AGAIN (safe for every OS)
    if (!fs.existsSync(cvFolder)) {
      fs.mkdirSync(cvFolder, { recursive: true });
    }

    cb(null, cvFolder);
  },

  filename: (req, file, cb) => {
    cb(
      null,
      "cv_" + req.user.id + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

// Routes
router.get("/me", auth, getMyProfile);
router.post("/", auth, upload.single("cv"), updateMyProfile);

module.exports = router;

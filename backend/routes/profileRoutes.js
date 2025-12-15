const express = require("express");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const auth = require("../middleware/authMiddleware");
const {
  getMyProfile,
  updateMyProfile,
} = require("../controllers/jobSeekerProfileController");

const router = express.Router();

// root uploads folder
const uploadsRoot = path.join(__dirname, "..", "uploads");

// ensure subfolders exist
const cvFolder = path.join(uploadsRoot, "cv");
const profileImgFolder = path.join(uploadsRoot, "profile-images");

[uploadsRoot, cvFolder, profileImgFolder].forEach((folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }
});

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = uploadsRoot;

    if (file.fieldname === "cv") {
      dest = cvFolder; // same as before
    } else if (file.fieldname === "profileImage") {
      dest = profileImgFolder;
    }

    cb(null, dest);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    if (file.fieldname === "cv") {
      cb(null, "cv_" + req.user.id + "_" + Date.now() + ext);
    } else if (file.fieldname === "profileImage") {
      cb(null, "img_" + req.user.id + "_" + Date.now() + ext);
    } else {
      cb(null, "file_" + req.user.id + "_" + Date.now() + ext);
    }
  },
});

const upload = multer({ storage });

// Routes
router.get("/me", auth, getMyProfile);

//  accept both cv and profileImage (same endpoint)
router.post(
  "/",
  auth,
  upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
  ]),
  updateMyProfile
);

module.exports = router;
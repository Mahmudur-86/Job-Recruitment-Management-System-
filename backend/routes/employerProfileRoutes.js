// routes/employerProfileRoutes.js
const express = require("express");
const path = require("path");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getMyEmployerProfile,
  upsertMyEmployerProfile,
} = require("../controllers/employerProfileController");

const router = express.Router();


  // Multer storage for company logos
  
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // /backend/uploads/company-logos
    cb(
      null,
      path.join(__dirname, "..", "uploads", "company-logos")
    );
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname); // .png / .jpg
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${unique}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});


   //Routes
   

// GET current employer profile
// GET /api/employer/profile
router.get("/profile", authMiddleware, getMyEmployerProfile);

// CREATE / UPDATE current employer profile
// POST /api/employer/profile
router.post(
  "/profile",
  authMiddleware,
  upload.single("companyLogo"),
  upsertMyEmployerProfile
);

module.exports = router;

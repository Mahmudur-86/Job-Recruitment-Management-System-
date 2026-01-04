// backend/routes/adminReportRoutes.js
const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getMonthlyReport,
  downloadMonthlyReportPdf,

  // 
  getRangeReport,
  downloadRangeReportPdf,
} = require("../controllers/adminReportController");

router.get("/monthly", authMiddleware, getMonthlyReport);
router.get("/monthly/pdf", authMiddleware, downloadMonthlyReportPdf);

// (calendar date range)
router.get("/range", authMiddleware, getRangeReport);
router.get("/range/pdf", authMiddleware, downloadRangeReportPdf);

module.exports = router;

// backend/routes/analyticsRoutes.js
const express = require("express");
const router = express.Router();
const { getAdminAnalytics } = require("../controllers/analyticsController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/admin", protect, authorize("admin"), getAdminAnalytics);

module.exports = router;
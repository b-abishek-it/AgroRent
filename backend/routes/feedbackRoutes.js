const express = require("express");
const { createFeedback, getAllFeedback } = require("../controllers/feedbackController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorize("farmer"), createFeedback);
router.get("/admin", protect, authorize("admin"), getAllFeedback);

module.exports = router;

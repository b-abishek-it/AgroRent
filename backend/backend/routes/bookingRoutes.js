const express = require("express");
const {
  createBooking,
  checkAvailability,
  getFarmerBookings,
  getBookingById,
  getOwnerBookings,
  approveBooking,
  rejectBooking,
  requestCancellation,
  approveCancellation,
  completeBooking,
  getAllBookings,
  downloadInvoice,
} = require("../controllers/bookingController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorize("farmer"), createBooking);
router.get("/availability", checkAvailability);
router.get("/farmer", protect, authorize("farmer"), getFarmerBookings);
router.get("/owner", protect, authorize("owner"), getOwnerBookings);
router.get("/:id", protect, getBookingById);
router.put("/:id/approve", protect, authorize("owner"), approveBooking);
router.put("/:id/reject", protect, authorize("owner"), rejectBooking);
router.put("/:id/request-cancel", protect, authorize("farmer"), requestCancellation);
router.put("/:id/approve-cancel", protect, authorize("owner"), approveCancellation);
router.put("/:id/complete", protect, authorize("farmer"), completeBooking);
router.get("/admin/all", protect, authorize("admin"), getAllBookings);
router.get("/:id/invoice", protect, downloadInvoice);

module.exports = router;

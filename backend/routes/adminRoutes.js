const express = require("express");
const {
  getDashboardStats,
  getUsers,
  blockUser,
  getMachinesForVerification,
  getAllMachines,
  verifyMachine,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/stats", getDashboardStats);
router.get("/users", getUsers);
router.put("/users/:id/block", blockUser);
router.get("/machines/pending", getMachinesForVerification);
router.get("/machines/all", getAllMachines);
router.put("/machines/:id/verify", verifyMachine);

module.exports = router;

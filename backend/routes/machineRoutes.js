const express = require("express");
const multer = require("multer");
const {
  addMachine,
  getVerifiedMachines,
  getMachineById,
  getOwnerMachines,
  updateMachine,
  deleteMachine,
} = require("../controllers/machineController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) return cb(null, true);
    return cb(new Error("Only image files are allowed"));
  },
});

router.get("/", getVerifiedMachines);
router.get("/owner/my", protect, authorize("owner"), getOwnerMachines);
router.get("/:id", getMachineById);
router.post("/", protect, authorize("owner"), upload.single("image"), addMachine);
router.put("/:id", protect, authorize("owner"), upload.single("image"), updateMachine);
router.delete("/:id", protect, authorize("owner"), deleteMachine);

module.exports = router;

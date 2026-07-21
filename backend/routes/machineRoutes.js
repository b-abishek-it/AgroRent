const express = require("express");
const multer = require("multer");
const path = require("path");
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "uploads")),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({ storage });

router.get("/", getVerifiedMachines);
router.get("/owner/my", protect, authorize("owner"), getOwnerMachines);
router.get("/:id", getMachineById);
router.post("/", protect, authorize("owner"), upload.single("image"), addMachine);
router.put("/:id", protect, authorize("owner"), upload.single("image"), updateMachine);
router.delete("/:id", protect, authorize("owner"), deleteMachine);

module.exports = router;

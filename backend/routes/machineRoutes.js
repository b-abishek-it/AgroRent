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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) return cb(null, true);
    return cb(new Error("Only image files are allowed"));
  },
});

// Middleware to handle multer errors and return clear 400 responses
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Image file is too large. Maximum size is 5 MB." });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  if (err && err.message === "Only image files are allowed") {
    return res.status(400).json({ message: err.message });
  }
  next(err);
};

router.get("/", getVerifiedMachines);
router.get("/owner/my", protect, authorize("owner"), getOwnerMachines);
router.get("/:id", getMachineById);
router.post("/", protect, authorize("owner"), upload.single("image"), handleMulterError, addMachine);
router.put("/:id", protect, authorize("owner"), upload.single("image"), handleMulterError, updateMachine);
router.delete("/:id", protect, authorize("owner"), deleteMachine);

module.exports = router;

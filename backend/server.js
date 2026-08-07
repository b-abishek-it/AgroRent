const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const connectDB = require("./config/db");

// Load .env from backend directory, or fallback to repo root .env if backend/.env is missing.
const envPath = fs.existsSync(path.join(__dirname, ".env"))
  ? path.join(__dirname, ".env")
  : path.join(__dirname, "..", ".env");

dotenv.config({
  path: envPath,
  override: true,
});

const authRoutes = require("./routes/authRoutes");
const machineRoutes = require("./routes/machineRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

// Connect Database
connectDB();

const app = express();
const legacyUploadsPath = path.join(__dirname, "uploads");

app.use(cors());
app.use(express.json());
// Read-only compatibility for machine records created before Cloudinary migration.
app.use("/uploads", express.static(legacyUploadsPath));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AgroRent API Running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/machines", machineRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/feedback", feedbackRoutes);

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: err.message,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

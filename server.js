const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const machineRoutes = require("./routes/machineRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

// Print MongoDB URI (for debugging)
console.log("MONGO_URI:", process.env.MONGO_URI);

// Connect to MongoDB
connectDB();

const app = express();

// Create uploads folder if it doesn't exist
const uploadsPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder
app.use("/uploads", express.static(uploadsPath));

// Test Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 AgroRent API Running Successfully",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/machines", machineRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/feedback", feedbackRoutes);

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
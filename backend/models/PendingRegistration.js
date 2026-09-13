const mongoose = require("mongoose");

const pendingRegistrationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    location: {
      type: String,
      enum: ["Thanjavur", "Kumbakonam", "Thiruvaiyaru", "Orathanadu", "Pattukottai"],
      required: true,
    },
    role: { type: String, enum: ["farmer", "owner"], required: true },
    passwordHash: { type: String, required: true },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    lastSentAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// TTL index to automatically delete expired pending registrations after a while (e.g., 24h)
// to keep the database clean
pendingRegistrationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model("PendingRegistration", pendingRegistrationSchema);

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    farmerId: { type: String, unique: true, sparse: true, trim: true },
    ownerId: { type: String, unique: true, sparse: true, trim: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    location: {
      type: String,
      enum: ["Thanjavur", "Kumbakonam", "Thiruvaiyaru", "Orathanadu", "Pattukottai"],
      required: true,
    },
    role: { type: String, enum: ["farmer", "owner"], required: true },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
    resetCode: { type: String, default: null },
    resetCodeExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

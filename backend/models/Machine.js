const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema(
  {
    machineCode: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["Tractor", "Harvester", "Sprayer", "Seeder", "Rotavator"],
      required: true,
    },
    description: { type: String, required: true, trim: true },
    registrationNumber: { type: String, required: true, trim: true },
    location: {
      type: String,
      enum: ["Thanjavur", "Kumbakonam", "Thiruvaiyaru", "Orathanadu", "Pattukottai"],
      required: true,
    },
    price: { type: Number, required: true, min: 0 },
    priceUnit: { type: String, enum: ["hour", "day"], default: "day" },
    image: { type: String, default: "" },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    driverId: { type: String, required: true, trim: true },
    driverName: { type: String, required: true, trim: true },
    driverLicenseNumber: { type: String, required: true, trim: true },
    driverPhoneNumber: { type: String, required: true, trim: true },
    verified: { type: Boolean, default: false },
    availability: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Machine", machineSchema);

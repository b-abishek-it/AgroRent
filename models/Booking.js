const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingCode: { type: String, required: true, unique: true, trim: true },
    machineId: { type: mongoose.Schema.Types.ObjectId, ref: "Machine", required: true },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookingDate: { type: Date, required: true },
    fromTime: { type: String, required: true, trim: true },
    toTime: { type: String, required: true, trim: true },
    durationHours: { type: Number, required: true, min: 0.25 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Completed",
        "Rejected",
        "Waiting",
        "CancellationRequested",
        "Cancelled",
      ],
      default: "Pending",
    },
    ownerNotified: { type: Boolean, default: false },
    queueNotified: { type: Boolean, default: false },
    paymentCompletedAt: { type: Date, default: null },
    paymentReference: { type: String, default: "", trim: true },
    invoiceFilePath: { type: String, default: "" },
    invoiceLanguage: { type: String, enum: ["en", "ta"], default: "en" },
  },
  { timestamps: true }
);

bookingSchema.index({ machineId: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ machineId: 1, bookingDate: 1, startDate: 1 });

module.exports = mongoose.model("Booking", bookingSchema);

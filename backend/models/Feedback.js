const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    feedbackCode: { type: String, required: true, unique: true, trim: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    description: { type: String, required: true, trim: true },
    submittedByRole: { type: String, enum: ["farmer", "owner"], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);

const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    feedbackCode: { type: String, required: true, unique: true, trim: true },
    bookingId: { type: String, required: true, trim: true },
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    description: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);

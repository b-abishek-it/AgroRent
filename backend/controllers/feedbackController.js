const Feedback = require("../models/Feedback");
const Booking = require("../models/Booking");
const { generatePrefixedId } = require("../utils/idGenerator");

const createFeedback = async (req, res) => {
  try {
    const { bookingId, rating, description } = req.body;

    if (!bookingId || !rating || !description) {
      return res.status(400).json({ message: "Booking ID, rating, and description are required" });
    }

    // Try finding by bookingCode first, then by _id as fallback
    let booking = await Booking.findOne({ bookingCode: bookingId });
    if (!booking && bookingId.length === 24) {
      booking = await Booking.findById(bookingId);
    }

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check for duplicate feedback from the same user for this booking
    const existingFeedback = await Feedback.findOne({
      bookingId: booking._id,
      submittedByRole: req.user.role,
    });

    if (existingFeedback) {
      return res.status(400).json({ message: "You have already submitted feedback for this booking" });
    }

    const feedbackCode = await generatePrefixedId({ key: "feedback", prefix: "FB", pad: 3 });

    const feedback = await Feedback.create({
      feedbackCode,
      bookingId: booking._id,
      farmerId: booking.farmerId,
      ownerId: booking.ownerId,
      rating,
      description,
      submittedByRole: req.user.role,
    });

    return res.status(201).json({ message: "Feedback submitted successfully", feedback });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({})
      .populate("farmerId", "farmerId name phone")
      .populate("ownerId", "ownerId name phone")
      .populate("bookingId", "bookingCode")
      .sort({ createdAt: -1 });

    return res.json(feedbacks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createFeedback,
  getAllFeedback,
};

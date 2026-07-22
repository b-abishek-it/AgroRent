const Feedback = require("../models/Feedback");
const { generatePrefixedId } = require("../utils/idGenerator");

const createFeedback = async (req, res) => {
  try {
    const { bookingId, description } = req.body;

    if (!bookingId || !description) {
      return res.status(400).json({ message: "Booking ID and feedback are required" });
    }

    const feedbackCode = await generatePrefixedId({ key: "feedback", prefix: "FB", pad: 3 });

    const feedback = await Feedback.create({
      feedbackCode,
      bookingId,
      farmerId: req.user._id,
      description,
    });

    return res.status(201).json({ message: "Feedback submitted", feedback });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({})
      .populate("farmerId", "farmerId name")
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

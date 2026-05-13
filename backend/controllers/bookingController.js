const fs = require("fs");
const Booking = require("../models/Booking");
const Machine = require("../models/Machine");
const { generatePrefixedId } = require("../utils/idGenerator");
const { createInvoiceBuffer, saveInvoiceFile } = require("../utils/invoicePdf");

const ACTIVE_STATUSES = ["Pending", "Approved", "CancellationRequested"];
const BOOKING_STATUSES_FOR_QUEUE = ["Waiting"];

const normalizeDateStart = (value) => {
  const date = new Date(value);
  date.setUTCHours(0, 0, 0, 0);
  return date;
};

const parseDateTime = (date, time) => new Date(`${date}T${time}:00`);

const roundHours = (hours) => Number(hours.toFixed(2));

const calculatePrice = ({ machine, durationHours }) => {
  if (machine.priceUnit === "hour") {
    return Number(machine.price) * durationHours;
  }

  const dayCount = Math.max(1, Math.ceil(durationHours / 24));
  return Number(machine.price) * dayCount;
};

const markExpiredApprovedAsCompleted = async () => {
  await Booking.updateMany(
    { status: "Approved", endDate: { $lte: new Date() } },
    { $set: { status: "Completed" } }
  );
};

const findOverlappingBooking = async ({ machineId, startDate, endDate }) => {
  const overlapping = await Booking.findOne({
    machineId,
    status: { $in: ACTIVE_STATUSES },
    startDate: { $lt: endDate },
    endDate: { $gt: startDate },
  });
  return overlapping;
};

const createBooking = async (req, res) => {
  try {
    const { machineId, date, fromTime, toTime } = req.body;

    if (!machineId || !date || !fromTime || !toTime) {
      return res.status(400).json({ message: "Machine, date, fromTime and toTime are required" });
    }

    const startDate = parseDateTime(date, fromTime);
    const endDate = parseDateTime(date, toTime);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate <= startDate) {
      return res.status(400).json({ message: "Invalid booking time range" });
    }

    const machine = await Machine.findById(machineId);
    if (!machine || !machine.verified || !machine.availability) {
      return res.status(404).json({ message: "Machine not available" });
    }

    const durationHours = roundHours((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
    const totalAmount = calculatePrice({ machine, durationHours });
    const bookingCode = await generatePrefixedId({ key: "booking", prefix: "B", pad: 3 });
    const bookingDate = normalizeDateStart(date);

    const overlapping = await findOverlappingBooking({ machineId, startDate, endDate });
    const status = overlapping ? "Waiting" : "Pending";

    const booking = await Booking.create({
      bookingCode,
      machineId,
      farmerId: req.user._id,
      ownerId: machine.ownerId,
      bookingDate,
      fromTime,
      toTime,
      durationHours,
      startDate,
      endDate,
      totalAmount,
      status,
    });

    if (status === "Waiting") {
      return res.status(201).json({
        message: "Slot is currently busy. Your request is added to waiting queue",
        booking,
      });
    }

    return res.status(201).json({ message: "Booking request sent to owner", booking });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const checkAvailability = async (req, res) => {
  try {
    const { machineId, date, fromTime, toTime } = req.query;

    if (!machineId || !date || !fromTime || !toTime) {
      return res.status(400).json({ message: "Machine, date, fromTime and toTime are required" });
    }

    const startDate = parseDateTime(date, fromTime);
    const endDate = parseDateTime(date, toTime);
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate <= startDate) {
      return res.status(400).json({ available: false, message: "Invalid booking time range" });
    }

    const machine = await Machine.findById(machineId);
    if (!machine || !machine.verified || !machine.availability) {
      return res.json({ available: false, message: "Not Available" });
    }

    const overlapping = await findOverlappingBooking({ machineId, startDate, endDate });
    if (overlapping) {
      return res.json({ available: false, message: "Not Available" });
    }

    return res.json({ available: true, message: "Available" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getFarmerBookings = async (req, res) => {
  try {
    await markExpiredApprovedAsCompleted();
    const bookings = await Booking.find({ farmerId: req.user._id })
      .populate("machineId", "machineCode name type registrationNumber driverId driverName driverLicenseNumber driverPhoneNumber")
      .sort({ createdAt: -1 });
    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("machineId", "machineCode name type registrationNumber driverId driverName driverLicenseNumber driverPhoneNumber price priceUnit location")
      .populate("farmerId", "farmerId name phone location")
      .populate("ownerId", "ownerId name phone location");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (
      req.user.role !== "admin" &&
      booking.ownerId._id.toString() !== req.user._id.toString() &&
      booking.farmerId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    return res.json(booking);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getOwnerBookings = async (req, res) => {
  try {
    await markExpiredApprovedAsCompleted();
    const bookings = await Booking.find({ ownerId: req.user._id })
      .populate("machineId", "machineCode name type registrationNumber")
      .populate("farmerId", "farmerId name phone location")
      .sort({ startDate: 1, createdAt: 1 });
    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const approveBooking = async (req, res) => {
  try {
    const lang = "en";
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (!["Pending", "Waiting"].includes(booking.status)) {
      return res.status(400).json({ message: "Only pending or waiting booking can be approved" });
    }

    const overlapping = await findOverlappingBooking({
      machineId: booking.machineId,
      startDate: booking.startDate,
      endDate: booking.endDate,
    });

    if (overlapping && overlapping._id.toString() !== booking._id.toString()) {
      booking.status = "Waiting";
      await booking.save();
      return res.status(409).json({ message: "Overlapping approved/pending booking exists. Request kept in waiting queue", booking });
    }

    booking.status = "Approved";
    await booking.save();

    const invoiceBooking = await Booking.findById(booking._id)
      .populate("machineId", "name type registrationNumber driverId driverName driverLicenseNumber driverPhoneNumber")
      .populate("farmerId", "name phone location")
      .populate("ownerId", "name phone");

    const invoiceFilePath = await saveInvoiceFile({ booking: invoiceBooking, lang });
    booking.invoiceFilePath = invoiceFilePath;
    booking.invoiceLanguage = lang;
    await booking.save();

    return res.json({ message: "Booking approved", booking });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (!["Pending", "Waiting", "CancellationRequested"].includes(booking.status)) {
      return res.status(400).json({ message: "Booking cannot be rejected now" });
    }

    booking.status = "Rejected";
    await booking.save();

    return res.json({ message: "Booking rejected", booking });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const requestCancellation = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (!["Pending", "Approved", "Waiting"].includes(booking.status)) {
      return res.status(400).json({ message: "Cancellation cannot be requested now" });
    }

    booking.status = "CancellationRequested";
    await booking.save();
    return res.json({ message: "Cancellation request sent to owner", booking });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const approveCancellation = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (!["CancellationRequested", "Approved", "Pending", "Waiting"].includes(booking.status)) {
      return res.status(400).json({ message: "Booking cannot be cancelled now" });
    }

    booking.status = "Cancelled";
    booking.ownerNotified = true;
    await booking.save();

    const nextWaiting = await Booking.findOne({
      machineId: booking.machineId,
      status: { $in: BOOKING_STATUSES_FOR_QUEUE },
      startDate: { $gte: booking.startDate },
    }).sort({ startDate: 1, createdAt: 1 });

    if (nextWaiting) {
      nextWaiting.status = "Pending";
      nextWaiting.queueNotified = true;
      await nextWaiting.save();
      return res.json({
        message: "Booking cancelled. Next waiting request has been moved to pending for owner approval",
        booking,
        nextWaiting,
      });
    }

    return res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const completeBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (booking.paymentCompletedAt) {
      return res.json({ message: "Payment already completed", booking });
    }

    const paymentReference = `RZP-DUMMY-${Date.now()}`;
    booking.status = "Completed";
    booking.paymentCompletedAt = new Date();
    booking.paymentReference = paymentReference;
    await booking.save();

    return res.json({ message: "Payment completed successfully", booking });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    await markExpiredApprovedAsCompleted();
    const bookings = await Booking.find({})
      .populate("machineId", "machineCode name type location price registrationNumber driverId driverName driverLicenseNumber driverPhoneNumber")
      .populate("farmerId", "farmerId name email phone location")
      .populate("ownerId", "ownerId name email phone location")
      .sort({ createdAt: -1 });

    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const downloadInvoice = async (req, res) => {
  try {
    const lang = "en";
    const booking = await Booking.findById(req.params.id)
      .populate("machineId", "name type registrationNumber driverId driverName driverLicenseNumber driverPhoneNumber")
      .populate("farmerId", "name phone location")
      .populate("ownerId", "name phone");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (
      req.user.role !== "admin" &&
      booking.ownerId._id.toString() !== req.user._id.toString() &&
      booking.farmerId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (!booking.paymentCompletedAt) {
      return res.status(400).json({ message: "Invoice is available only after payment completion" });
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice-${booking._id}.pdf`);

    if (booking.invoiceFilePath && booking.invoiceLanguage === "en" && fs.existsSync(booking.invoiceFilePath)) {
      return res.sendFile(booking.invoiceFilePath);
    }

    const pdfBuffer = await createInvoiceBuffer({ booking, lang });
    return res.end(pdfBuffer);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBooking,
  checkAvailability,
  getFarmerBookings,
  getBookingById,
  getOwnerBookings,
  approveBooking,
  rejectBooking,
  requestCancellation,
  approveCancellation,
  completeBooking,
  getAllBookings,
  downloadInvoice,
};

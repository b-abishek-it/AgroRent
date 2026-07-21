const Machine = require("../models/Machine");
const Booking = require("../models/Booking");
const { generatePrefixedId } = require("../utils/idGenerator");

const attachCurrentAvailability = async (machine) => {
  const now = new Date();
  const activeBooking = await Booking.findOne({
    machineId: machine._id,
    status: { $in: ["Approved", "CancellationRequested"] },
    startDate: { $lte: now },
    endDate: { $gt: now },
  });

  return {
    ...machine.toObject(),
    availability: !activeBooking,
  };
};

const addMachine = async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      location,
      price,
      priceUnit,
      registrationNumber,
      driverName,
      driverLicenseNumber,
      driverPhoneNumber,
    } = req.body;

    if (
      !name ||
      !type ||
      !description ||
      !location ||
      !price ||
      !registrationNumber ||
      !driverName ||
      !driverLicenseNumber ||
      !driverPhoneNumber
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const machineCode = await generatePrefixedId({ key: "machine", prefix: "MA", pad: 3 });
    const driverId = await generatePrefixedId({ key: "driver", prefix: "D", pad: 3 });

    const machine = await Machine.create({
      machineCode,
      name,
      type,
      description,
      registrationNumber,
      location,
      price: Number(price),
      priceUnit: priceUnit || "day",
      image: req.file ? `/uploads/${req.file.filename}` : "",
      ownerId: req.user._id,
      driverId,
      driverName,
      driverLicenseNumber,
      driverPhoneNumber,
      verified: false,
      availability: true,
    });

    return res.status(201).json({ message: "Machine added and awaiting admin verification", machine });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getVerifiedMachines = async (req, res) => {
  try {
    const { type, location } = req.query;
    const query = { verified: true };

    if (type) query.type = type;
    if (location) query.location = location;

    const machines = await Machine.find(query).populate("ownerId", "name phone").sort({ createdAt: -1 });
    const machinesWithAvailability = await Promise.all(machines.map((machine) => attachCurrentAvailability(machine)));
    return res.json(machinesWithAvailability);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMachineById = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id).populate("ownerId", "name phone location");
    if (!machine) return res.status(404).json({ message: "Machine not found" });
    const withAvailability = await attachCurrentAvailability(machine);
    return res.json(withAvailability);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getOwnerMachines = async (req, res) => {
  try {
    const machines = await Machine.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
    return res.json(machines);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateMachine = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);
    if (!machine) return res.status(404).json({ message: "Machine not found" });
    if (machine.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const update = { ...req.body };
    if (req.file) update.image = `/uploads/${req.file.filename}`;

    if (update.price) update.price = Number(update.price);
    update.verified = false;

    const updatedMachine = await Machine.findByIdAndUpdate(req.params.id, update, { new: true });
    return res.json({ message: "Machine updated and pending re-verification", machine: updatedMachine });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteMachine = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);
    if (!machine) return res.status(404).json({ message: "Machine not found" });
    if (machine.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Machine.findByIdAndDelete(req.params.id);
    return res.json({ message: "Machine deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addMachine,
  getVerifiedMachines,
  getMachineById,
  getOwnerMachines,
  updateMachine,
  deleteMachine,
};

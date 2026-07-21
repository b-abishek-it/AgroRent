const User = require("../models/User");
const Machine = require("../models/Machine");
const Booking = require("../models/Booking");
const Feedback = require("../models/Feedback");

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMachines = await Machine.countDocuments();
    const bookings = await Booking.find({}, "totalAmount");
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount * 0.05, 0);

    return res.json({ totalUsers, totalMachines, totalRevenue });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "farmerId ownerId name email phone location role isBlocked").sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "owner") {
      const ownerMachines = await Machine.find({ ownerId: user._id }, "_id");
      const ownerMachineIds = ownerMachines.map((machine) => machine._id);

      await Booking.deleteMany({
        $or: [{ ownerId: user._id }, { machineId: { $in: ownerMachineIds } }],
      });
      await Machine.deleteMany({ ownerId: user._id });
    }

    if (user.role === "farmer") {
      await Feedback.deleteMany({ farmerId: user._id });
      await Booking.deleteMany({ farmerId: user._id });
    }

    await User.deleteOne({ _id: user._id });

    return res.json({ message: "User removed permanently" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMachinesForVerification = async (req, res) => {
  try {
    const machines = await Machine.find({ verified: false }).populate("ownerId", "name").sort({ createdAt: -1 });
    return res.json(machines);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllMachines = async (req, res) => {
  try {
    const machines = await Machine.find({})
      .populate("ownerId", "ownerId name phone location")
      .sort({ createdAt: -1 });
    return res.json(machines);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const verifyMachine = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);
    if (!machine) return res.status(404).json({ message: "Machine not found" });

    machine.verified = true;
    await machine.save();

    return res.json({ message: "Machine verified" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  blockUser,
  getMachinesForVerification,
  getAllMachines,
  verifyMachine,
};

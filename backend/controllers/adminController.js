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
    const users = await User.find({}, "farmerId ownerId name email phone location role isBlocked isDeleted").sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    return res.json({ message: `User account has been ${user.isBlocked ? 'deactivated' : 'activated'}` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isDeleted = true;
    await user.save();

    if (user.role === "owner") {
      await Machine.updateMany({ ownerId: user._id }, { isDeleted: true });
    }

    return res.json({ message: "User permanently removed from platform" });
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
    machine.verificationStatus = "Approved";
    await machine.save();

    return res.json({ message: "Machine verified" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const rejectMachine = async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id);
    if (!machine) return res.status(404).json({ message: "Machine not found" });

    machine.verified = false;
    machine.verificationStatus = "Rejected";
    await machine.save();

    return res.json({ message: "Machine rejected" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  toggleBlockUser,
  deleteUser,
  getMachinesForVerification,
  getAllMachines,
  verifyMachine,
  rejectMachine,
};

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const { generatePrefixedId } = require("../utils/idGenerator");

const generateToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

const register = async (req, res) => {
  try {
    const { name, email, phone, location, role, password } = req.body;

    if (!name || !email || !phone || !location || !role || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["farmer", "owner"].includes(role)) {
      return res.status(400).json({ message: "Only Farmer and Machinery Owner can register" });
    }

    if (!/^\d{4}$/.test(password)) {
      return res.status(400).json({ message: "Password must be a 4 digit PIN" });
    }

    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res.status(400).json({ message: "Email or phone already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userIdField = role === "farmer" ? "farmerId" : "ownerId";
    const generatedId = await generatePrefixedId({
      key: role === "farmer" ? "farmer" : "owner",
      prefix: role === "farmer" ? "F" : "M",
      pad: 3,
    });

    const user = await User.create({
      [userIdField]: generatedId,
      name,
      email,
      phone,
      location,
      role,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Registered successfully",
      user: {
        _id: user._id,
        farmerId: user.farmerId || null,
        ownerId: user.ownerId || null,
        name: user.name,
        role: user.role,
        email: user.email,
        phone: user.phone,
        location: user.location,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { role, phone, password } = req.body;

    if (!role || !phone || !password) {
      return res.status(400).json({ message: "Role, phone and password are required" });
    }

    if (role === "admin") {
      if (phone === "admin" && password === "1234") {
        const token = generateToken({ id: "admin", role: "admin" });
        return res.json({
          token,
      user: {
        _id: "admin",
        adminId: "ADMIN",
        name: "Admin",
        role: "admin",
            phone: "admin",
            location: "Thanjavur",
          },
        });
      }
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const user = await User.findOne({ phone, role });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "User is blocked by admin" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ id: user._id, role: user.role });

    return res.json({
      token,
      user: {
        _id: user._id,
        farmerId: user.farmerId || null,
        ownerId: user.ownerId || null,
        name: user.name,
        role: user.role,
        email: user.email,
        phone: user.phone,
        location: user.location,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = otp;
    user.resetCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "AgroRent Password Reset OTP",
      text: `Your AgroRent OTP is ${otp}. It is valid for 10 minutes.`,
    });

    return res.json({ message: "OTP sent to email" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP and new password are required" });
    }

    if (!/^\d{4}$/.test(newPassword)) {
      return res.status(400).json({ message: "New password must be a 4 digit PIN" });
    }

    const user = await User.findOne({ email });
    if (!user || user.resetCode !== otp || !user.resetCodeExpires || user.resetCodeExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = null;
    user.resetCodeExpires = null;
    await user.save();

    return res.json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};

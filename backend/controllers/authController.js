const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const PasswordReset = require("../models/PasswordReset");
const { generatePrefixedId } = require("../utils/idGenerator");
const { sendWelcomeEmail, sendPasswordResetOtpEmail } = require("../services/mailjet.service");

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

    // Send Welcome Email
    sendWelcomeEmail(user.email, user.name, user.role);

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

    if (user.isDeleted) {
      return res.status(403).json({ message: "User account has been permanently deleted" });
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
      // Safe response to prevent email enumeration
      return res.json({ message: "If the email is registered, a password reset OTP has been sent." });
    }

    let resetRecord = await PasswordReset.findOne({ userId: user._id });
    
    // Check cooldown
    if (resetRecord && Date.now() - resetRecord.lastSentAt.getTime() < 60000) {
      return res.status(429).json({ message: "Please wait 60 seconds before requesting another OTP." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    if (resetRecord) {
      resetRecord.otpHash = otpHash;
      resetRecord.expiresAt = expiresAt;
      resetRecord.attempts = 0;
      resetRecord.used = false;
      resetRecord.resetToken = null;
      resetRecord.lastSentAt = Date.now();
      await resetRecord.save();
    } else {
      await PasswordReset.create({
        userId: user._id,
        otpHash,
        expiresAt,
      });
    }

    await sendPasswordResetOtpEmail(user.email, user.name, otp, 5);

    return res.json({ message: "If the email is registered, a password reset OTP has been sent." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const resetRecord = await PasswordReset.findOne({ userId: user._id });
    if (!resetRecord || resetRecord.used || resetRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (resetRecord.attempts >= 5) {
      return res.status(429).json({ message: "Too many failed attempts. Please request a new OTP." });
    }

    const isMatch = await bcrypt.compare(otp, resetRecord.otpHash);
    if (!isMatch) {
      resetRecord.attempts += 1;
      await resetRecord.save();
      return res.status(400).json({ message: "Invalid OTP" });
    }

    resetRecord.used = true;
    const resetToken = crypto.randomBytes(32).toString("hex");
    resetRecord.resetToken = resetToken;
    await resetRecord.save();

    return res.json({ message: "OTP verified successfully", resetToken });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: "Reset token and new password are required" });
    }

    if (!/^\d{4}$/.test(newPassword)) {
      return res.status(400).json({ message: "New password must be a 4 digit PIN" });
    }

    const resetRecord = await PasswordReset.findOne({ resetToken });
    if (!resetRecord || !resetRecord.used || resetRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const user = await User.findById(resetRecord.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    // Clear old plaintext reset code logic just in case it existed
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    await PasswordReset.findByIdAndDelete(resetRecord._id);

    return res.json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
};

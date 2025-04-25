const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Candidates = require("../models/candidates");
const sendEmail = require("../utils/sendEmail");

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    console.log("Received email:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes

    await user.save();
    console.log("Reset token saved for user:", user.email);

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const message = `
      <h1>You have requested a password reset</h1>
      <p>Please go to this link to reset your password:</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;

    console.log("Reset URL:", resetUrl);

    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });

      console.log("Email sent successfully to:", user.email);
      res.status(200).json({ message: "Email sent" });
    } catch (error) {
      console.error("Error sending email:", error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
//

exports.resetPassword = async (req, res) => {
  console.log("Received token:", req.params.token);
  console.log("Received payload:", req.body);

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  console.log("Hashed token:", resetPasswordToken);

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      console.log("Invalid or expired token");
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    console.log("User found:", user.email);

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    console.log("Password has been reset successfully for user:", user.email);

    const candidate = await Candidates.findOne({ email: user.email });
    if (candidate) {
      candidate.password = hashedPassword;
      await candidate.save();
      console.log("Password has been updated for candidate:", candidate.email);
    }

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Server error during password reset:", error);
    res.status(500).json({ message: "Server error" });
  }
};

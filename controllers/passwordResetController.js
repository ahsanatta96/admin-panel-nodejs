const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const randomstring = require("randomstring");
const sgMail = require("@sendgrid/mail");
const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler"); // Import asyncHandler

// Configure SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function to send password reset OTP via email
const sendPasswordResetOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate a random OTP
    const otp = randomstring.generate({ length: 6, charset: "numeric" });

    // Save the OTP in the user's profile in the database
    user.resetPasswordOTP = otp;
    await user.save();

    // Send the OTP via email
    const emailTemplatePath = path.join(
      __dirname,
      "..",
      "email_templates",
      "otp_reset.html"
    );
    const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");
    const emailContent = emailTemplate.replace("{{ otp }}", otp);

    const msg = {
      to: email,
      from: "blue@americanclinictokyo.com",
      subject: "Password Reset OTP",
      html: emailContent,
    };

    await sgMail.send(msg);

    res.json({
      message: "OTP sent successfully. Check your email for the OTP.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
});

// Function to verify password reset OTP and update user's password
const verifyPasswordResetOTP = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the OTP is correct
    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // Reset the user's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetPasswordOTP = undefined; // Clear the OTP after password reset
    await user.save();

    res.json({
      message:
        "Password reset successful. You can now log in with your new password.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
});

module.exports = { sendPasswordResetOTP, verifyPasswordResetOTP };

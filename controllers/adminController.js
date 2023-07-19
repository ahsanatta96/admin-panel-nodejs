const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

const changePassword = asyncHandler(async (req, res) => {
  const { id } = req.user;
  const { newPassword } = req.body;

  try {
    const adminUser = await User.findById(id);
    if (!adminUser.isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not authorized to change passwords." });
    }

    const userToUpdate = await User.findById(req.params.id);
    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    userToUpdate.password = hashedPassword;
    await userToUpdate.save();

    res.json({ message: "Password changed successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong.", error: error.message });
  }
});

module.exports = { changePassword };

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Please add your name."],
    },
    email: {
      type: String,
      require: [true, "Please add your email."],
      unique: true,
    },
    password: {
      type: String,
      require: [true, "Please add your password."],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    resetPasswordOTP: {
      type: String,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);

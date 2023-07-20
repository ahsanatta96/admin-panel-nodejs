const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { changePassword } = require("../controllers/adminController");
const {
  sendPasswordResetOTP,
  verifyPasswordResetOTP,
} = require("../controllers/passwordResetController");

const { loginUser } = require("../controllers/userController");

router
  .post("/login", loginUser)
  .put("/change-password/:id", protect, changePassword)
  .post("/reset-password", sendPasswordResetOTP)
  .post("/reset-password/verify", verifyPasswordResetOTP);

module.exports = router;

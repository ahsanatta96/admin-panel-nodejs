const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { changePassword, getDashbordCounts } = require("../controllers/adminController");
const {
  sendPasswordResetOTP,
  verifyPasswordResetOTP,
} = require("../controllers/passwordResetController");

const { loginUser, getUserByID } = require("../controllers/userController");

router
  // .get("/:id", getUserByID)
  .get("/dashboardCounts",getDashbordCounts)
  .post("/login", loginUser)
  .put("/change-password/:id", protect, changePassword)
  .post("/reset-password", sendPasswordResetOTP)
  .post("/reset-password/verify", verifyPasswordResetOTP);

module.exports = router;

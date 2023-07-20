const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { validate } = require("../middlewares/validateMiddleware");
const {
  uploadImage,
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
} = require("../controllers/packageController");

router
  .post("/add", protect, validate, uploadImage, createPackage)
  .patch("/update/:id", protect, validate, uploadImage, updatePackage)
  .delete("/delete/:id", protect, validate, deletePackage)
  .get("/:id", getPackageById)
  .get("/", getAllPackages);

module.exports = router;

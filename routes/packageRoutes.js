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
  .put("/update/:id", protect, validate, updatePackage)
  .delete("/delete/:id", protect, validate, deletePackage)
  .get("/getOne/:id", getPackageById)
  .get("/getAll", getAllPackages);

module.exports = router;

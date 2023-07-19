const asyncHandler = require("express-async-handler");
const Package = require("../models/packageModel");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./data");
  },
  filename: function (req, file, cb) {
    // Generate a unique filename using timestamp and random string
    const timestamp = Date.now();
    const randomString = uuidv4().split("-").join("");
    const extension = file.originalname.split(".").pop();
    const uniqueFilename = `${timestamp}-${randomString}.${extension}`;
    cb(null, uniqueFilename);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

// Controller function for handling file upload
const uploadImage = upload.single("image");

// Controller function for creating a new package
const createPackage = asyncHandler(async (req, res) => {
  const { name, price, description, features } = req.body;

  if (!name || !description) {
    res.status(400).json({ message: "Please add all fields" });
  }

  const packageExists = await Package.findOne({ name });

  if (packageExists) {
    res.status(400).json({ message: "Package already exists" });
  }

  // Create the new package
  const newPackage = await Package.create({
    name,
    price,
    description,
    features,
    image: req.file ? req.file.filename : null,
  });
  res.status(201).json(newPackage);
});

// Get all packages
const getAllPackages = asyncHandler(async (req, res) => {
  const packages = await Package.find();
  res.status(200).json(packages);
});

// Get a single package by ID
const getPackageById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const package = await Package.findById(id);

  if (!package) {
    return res.status(404).json({ message: "Package not found." });
  }

  res.status(200).json(package);
});

// Update a package by ID
const updatePackage = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const { name, description, features } = req.body;

  // Perform any validation or data sanitization if necessary

  const updatedPackage = await Package.findByIdAndUpdate(
    id,
    { name, description, features },
    { new: true, runValidators: true }
  );

  if (!updatedPackage) {
    return res.status(404).json({ message: "Package not found." });
  }

  res.status(200).json(updatedPackage);
});

// Delete a package by ID
const deletePackage = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const deletedPackage = await Package.findByIdAndDelete(id);

  if (!deletedPackage) {
    return res.status(404).json({ message: "Package not found" });
  }

  res.status(200).json({ message: "Package deleted successfully" });
});

module.exports = {
  uploadImage,
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
};

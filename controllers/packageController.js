const asyncHandler = require("express-async-handler");
const Package = require("../models/packageModel");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);


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
// const uploadImage = upload.single("image");
const uploadImage = upload.array("images", 10);

// Controller function for creating a new package
const createPackage = asyncHandler(async (req, res) => {
  console.log('res',req.body)
  const { name, adultprice, childPrice, rating, TimeDuration, description, features,pickup } = req.body;

  if (!name || !description || !adultprice || !childPrice || !rating || !TimeDuration || !pickup) {
    res.status(400).json({ message: "Please add all fields" });
  }

  const packageExists = await Package.findOne({ name });

  if (packageExists) {
    res.status(400).json({ message: "Package already exists" });
  }

  // Create the new package
  const newPackage = await Package.create({
    name,
    adultprice,
    childPrice,
    rating,
    TimeDuration,
    description,
    features,
    pickup,
    images: req.files.map((file) => file.filename),
  });
  console.log('new',newPackage)
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
  const {name, adultprice, childPrice, rating, TimeDuration, description, features,pickup } = req.body;

  const existingPackage = await Package.findById(id);

  if (!existingPackage) {
    return res.status(404).json({ message: "Package not found." });
  }

  // Store the old image filename for later removal
  const oldImageFilenames = existingPackage.images;

  // Update the package document in the database with the new fields
  existingPackage.name = name;
  existingPackage.description = description;
  existingPackage.features = features;
  existingPackage.adultprice = adultprice;
  existingPackage.childPrice = childPrice;
  existingPackage.rating = rating;
  existingPackage.TimeDuration = TimeDuration;
  existingPackage.pickup = pickup;
  
  


  if (req.files && req.files.length > 0) {
    existingPackage.images = req.files.map((file) => file.filename);
  }

  const updatedPackage = await existingPackage.save();

  // Remove the older image files from the data folder if there was a change in the images
  if (req.files) {
    for (const oldImageFilename of oldImageFilenames) {
      if (!updatedPackage.images.includes(oldImageFilename)) {
        const imagePathToRemove = path.join(__dirname, "../data", oldImageFilename);
        await unlinkAsync(imagePathToRemove);
      }
    }
  }

  res.status(200).json(updatedPackage);
});

// Delete a package by ID
const deletePackage = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const deletedPackage = await Package.findByIdAndDelete(id);

  if (!deletedPackage) {
    return res.status(404).json({ message: "Package not found." });
  }

  // Remove the associated image from the data folder
  if (deletedPackage.image) {
    const imagePathToRemove = path.join(
      __dirname,
      "../data",
      deletedPackage.image
    );
    await unlinkAsync(imagePathToRemove);
  }

  res.status(200).json({ message: "Package deleted successfully." });
});

module.exports = {
  uploadImage,
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
};

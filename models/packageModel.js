const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      require: [true, "Please add package name."],
    },
    price: {
      type: Number,
      require: true,
    },
    image: {
      type: String,
    },
    description: {
      type: String,
    },
    features: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Package", packageSchema);

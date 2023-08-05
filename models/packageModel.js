const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    adultprice: {
      type: Number,
      require: true,
    },
    childPrice: {
      type: Number,
      require: true,
    },
    rating: {
      type: Number,
      require: true,
    },
    images: {
      type: [String],
      default:[],
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    TimeDuration:{
      type:String,
      require:true,
    },
    pickup: {
      type: Boolean,
      default: true,
    },
    features: {
      type: [String],
      default: [],
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Package", packageSchema);

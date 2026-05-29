const mongoose = require("mongoose");

const brandSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
    },
    logo: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamp: true },
);

const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;

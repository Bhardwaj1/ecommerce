const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
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
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    volume: {
      type: Number,
      required: true,
      min: 0,
    },

    alcoholPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    category: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },
    images: [{ url: String, public_id: String }],
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

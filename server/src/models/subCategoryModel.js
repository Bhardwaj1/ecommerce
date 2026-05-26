const mongoose = require("mongoose");

const subCategoryScehma = new mongoose.Schema(
  {
    name: {
      required: true,
      trim: true,
      type: String,
    },
    description: {
      required: true,
      trim: true,
      type: String,
    },
    parentCategory: {
      required: true,
      ref: "Category",
      type: mongoose.Types.ObjectId,
    },
    active: {
      type: Boolean,
      defualt: true,
    },
  },
  { timestamps: true },
);

const SubCategory = mongoose.model("SubCategory", subCategoryScehma);
module.exports = SubCategory;

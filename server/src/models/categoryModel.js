const mongoose = require("mongoose");

const catgeorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
});

const Category = mongoose.model("Category", catgeorySchema);
module.exports = Category;

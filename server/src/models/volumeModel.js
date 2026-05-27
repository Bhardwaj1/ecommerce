const mongoose = require("mongoose");

const volumeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    valueInMl: {
      type: Number,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Volume = mongoose.model("Volume", volumeSchema);

module.exports = Volume;

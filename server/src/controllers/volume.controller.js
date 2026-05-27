const Volume = require("../models/volumeModel");

const createVolume = async (req, res) => {
  try {
    const { name, valueInMl } = req.body;

    const existingVolume = await Volume.findOne({ name });

    if (existingVolume) {
      return res.status(409).json({
        success: false,
        error: `${name} Volume already exists`,
      });
    }

    let volume = new Volume({
      name,
      valueInMl,
    });

   let savedValue= await volume.save();

    let formattedVolume= {
        name:savedValue?.name,
        valueInMl:savedValue?.valueInMl,
        _id:savedValue?._id,
    }
    res.status(201).json({
      success: true,
      message: "Volume created successfully",
      volume: formattedVolume,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
const getAllVolume = async (req, res) => {};
const updateVolume = async (req, res) => {};
const deleteVolume = async (req, res) => {};

module.exports = { createVolume, getAllVolume, updateVolume, deleteVolume };

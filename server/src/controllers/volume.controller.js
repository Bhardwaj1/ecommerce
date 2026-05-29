const Volume = require("../models/volumeModel");
const asyncHandler = require("../utils/asyncHandler");

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

    let savedValue = await volume.save();

    let formattedVolume = {
      name: savedValue?.name,
      valueInMl: savedValue?.valueInMl,
      _id: savedValue?._id,
    };
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
const getAllVolume = asyncHandler(async (req, res) => {
  let { search = "", perPage = 10, page = 1 } = req.query;
  page = Number(page);
  perPage = Number(perPage);
  let matchFilter = {};
  if (search) {
    matchFilter = {
      $or: [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    };
  }
  let totalRecords = await Volume.countDocuments(matchFilter);
  let volume = await Volume.aggregate([
    { $match: matchFilter },
    { $project: { _id: 1, name: 1, valueInMl: 1, createdAt: 1 } },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * perPage },
    { $limit: perPage },
  ]);
  res.status(200).json({
    success: true,
    message: "Volume fetched successfully",
    data: volume,

    meta: {
      page: page,
      totalRecords,
      perPage,
      totalPages: Math.ceil(totalRecords / perPage),
    },
  });
});
const updateVolume = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const volume = await Volume.findByIdAndUpdate(id, req.body, {
    returnDocument: "after",
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Volume updated successfully",
    volume: volume,
  });
});
const deleteVolume = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const volume = await Volume.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "Volume deleted successfully",
  });
});

module.exports = { createVolume, getAllVolume, updateVolume, deleteVolume };

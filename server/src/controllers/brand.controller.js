const Brand = require("../models/brandModel");
const asyncHandler = require("../utils/asyncHandler");
const slugify = require("slugify");
const Cloudinary = require("../config/cloudinary");

const createBrand = asyncHandler(async (req, res) => {
  const { name, description, logo, active } = req.body;

  const checkExistingBrand = await Brand.findOne({
    name: {
      $regex: `^${name}$`,
      $options: "i",
    },
  });

  if (checkExistingBrand) {
    return res.status(409).json({
      success: false,
      error: "Brand already exists",
    });
  }

  let uploadedImage = {};

  if (req.files) {
    const result = await Cloudinary.uploader.upload(req.files.path, {
      folder: "brandLogo",
    });
    uploadedImage = {
      url: result.url,
      public_id: result.public_id,
    };
  }

  const brand = new Brand({
    name,
    slug: slugify(name, {
      lower: true,
      strict: true,
    }),
    logo: uploadedImage,
    description,
    active,
  });

  await brand.save();

  res.status(201).json({
    success: true,
    message: "Brand created successfully",
  });
});

const getAllBrand = asyncHandler(async (req, res) => {});

const updateBrand = asyncHandler(async (req, res) => {});

const deleteBrand = asyncHandler(async (req, res) => {});

module.exports = { createBrand, getAllBrand, deleteBrand, updateBrand };

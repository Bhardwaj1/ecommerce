const Brand = require("../models/brandModel");
const Product = require("../models/productModel");
const asyncHandler = require("../utils/asyncHandler");
const slugify = require("slugify");
const Cloudinary = require("../config/cloudinary");

const createBrand = asyncHandler(async (req, res) => {
  const { name, description, active } = req.body;

  const normaLizedName = name.trim().toLowerCase();

  const checkExistingBrand = await Brand.findOne({
    name: normaLizedName,
  });

  if (checkExistingBrand) {
    return res.status(409).json({
      success: false,
      error: "Brand already exists",
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: "Brand logo is required",
    });
  }

  const result = await Cloudinary.uploader.upload(req.file.path, {
    folder: "brandLogo",
  });

  const brand = new Brand({
    name: normaLizedName,
    slug: slugify(name, {
      lower: true,
      strict: true,
    }),
    logo: {
      url: result.secure_url,
      public_id: result.public_id,
    },
    description,
    active,
  });

  await brand.save();

  const formattedData = {
    _id: brand?._id,
    name: brand?.name,
    description: brand?.description,
    logo: brand?.logo?.url,
    createdAt: brand?.createdAt,
  };

  res.status(201).json({
    success: true,
    message: "Brand created successfully",
    brand: formattedData,
  });
});

const getAllBrand = asyncHandler(async (req, res) => {
  let { search = "", perPage = 10, page = 1 } = req.query;
  perPage = Number(perPage) || 10;
  page = Number(page) || 1;

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
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    };
  }
  const brands = await Brand.find(matchFilter)
    .skip((page - 1) * perPage)
    .limit(perPage)
    .sort({ createdAt: -1 });

  let formattedData = brands.map((item) => ({
    _id: item?._id,
    name: item?.name,
    description: item?.description,
    active: item?.active,
    logo: item?.logo,
    createdAt: item?.createdAt,
  }));

  const totalRecords = await Brand.countDocuments(matchFilter);

  res.status(200).json({
    success: true,
    message: "Brands fetched successfully",
    data: formattedData,
    meta: {
      page: page,
      totalRecords,
      perPage,
      totalPages: Math.ceil(totalRecords / perPage),
    },
  });
});

const updateBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, active } = req.body;

  console.log(req.body);
  console.log(req.file);

  const brand = await Brand.findById(id);

  if (!brand) {
    return res.status(404).json({
      success: false,
      error: "Brand not found",
    });
  }

  if (name) {
    const normalizedName = name.trim().toLowerCase();
    const existingBrand = await Brand.findOne({
      name: normalizedName,
      _id: { $ne: id },
    });

    if (existingBrand) {
      return res.status(409).json({
        success: false,
        error: "Brand already exists",
      });
    }

    brand.name = normalizedName;
    brand.slug = slugify(normalizedName, {
      lower: true,
      strict: true,
    });
  }

  if (description !== undefined) {
    brand.description = description;
  }

  if (active != undefined) {
    brand.active = active;
  }

  if (req.file) {
    await Cloudinary.uploader.destroy(brand.logo.public_id);

    const result = await Cloudinary.uploader.upload(req.file.path, {
      folder: "brandLogo",
    });

    brand.logo = {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  await brand.save();

  res.status(200).json({
    success: true,
    message: "Brand updated successfully",
    data: brand,
  });
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let data = await Brand.findById(id);
  if (!data) {
    return res.status(404).json({
      success: false,
      error: "Brand not found",
    });
  }

  const productUsingBrand = await Product.findOne({
    brand: id,
  });

  if (productUsingBrand) {
    return res.status(409).json({
      success: false,
      error: "Brand is already in use",
    });
  }

  await Brand.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Brand delete successfully",
  });
});

module.exports = { createBrand, getAllBrand, deleteBrand, updateBrand };

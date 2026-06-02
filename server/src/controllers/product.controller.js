const Product = require("../models/productModel");
const cloudinary = require("../config/cloudinary");
const slugify = require("slugify");

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      brand,
      alcoholPercentage,
      category,
      subCategory,
      active,
    } = req.body;
    const uploadedImages = [];
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }
    let product = new Product({
      name,
      slug: slugify(name.toLowerCase(), {
        strict: true,
        lower: true,
      }),
      description,
      price,
      stock,
      brand,
      volume,
      alcoholPercentage,
      category,
      subCategory,
      images: uploadedImages,
      active,
    });

    await product.save();
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
const getAllProduct = async (req, res) => {
  try {
    let { search = "", perPage = 10, page = 1 } = req.query;

    page = Number(page);
    perPage = Number(perPage);

    let filter = {};

    if (search) {
      filter = {
        $or: [
          {
            name: {
              regex: search,
              options: "i",
            },
          },
          {
            description: {
              regex: search,
              options: "i",
            },
          },
          {
            category: {
              regex: search,
              options: "i",
            },
          },
          {
            subCategory: {
              regex: search,
              options: "i",
            },
          },
        ],
      };
    }

    const totalRecords = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .select(
        "_id name slug price volume alcoholPercentage category images subCategory active",
      )
      .populate("category", "name _id")
      .populate("subCategory", "name _id")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    let formattedProducts = products.map((item) => ({
      _id: item?._id,
      name: item?.name,
      slug: item?.slug,
      alcoholPercentage: item?.alcoholPercentage,
      category: item?.category,
      thumbnails: item?.images[0].url,
      subCategory: item?.subCategory,
      active: item?.active,
    }));

    res.status(200).json({
      success: true,
      data: formattedProducts,
      message: "Products fetched successfully",
      meta: {
        page: page,
        totalRecords,
        perPage,
        totalPages: Math.ceil(totalRecords / perPage),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getSingleProduct = async (req, res) => {};
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found",
      });
    }

    const existingImage = JSON.parse(req.body.existingImage || "[]");

    const imageToDelete = product.images.filter(
      (oldImages) =>
        !existingImage.some((img) => img.public_id === oldImages.public_id),
    );

    for (let images of imageToDelete) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    const uploadedImages = [];

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
        uploadedImages.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    const finalImages = [...existingImage, ...uploadedImages];

    product.name = req.body.name;
    product.slug = req.body.slug;
    product.description = req.body.description;
    product.images = finalImages;
    await product.save();
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete({ id });
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
};

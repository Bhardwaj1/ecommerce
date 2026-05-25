const Product = require("../models/productModel");
const cloudinary = require("../config/cloudinary");

const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      stock,
      brand,
      volume,
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

    const duplicate = await Product.findOne({ slug });

    if (duplicate) {
      return res.status(409).json({
        success: false,
        error: "Product already exists",
      });
    }
    let product = new Product({
      name,
      slug,
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
    const { search = "", perPage = 10, page = 1 } = req.query;

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
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products,
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

    // const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
    //   returnDocument: "after",
    //   runValidators: true,
    // });
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

module.exports = { createProduct, getAllProduct, updateProduct, deleteProduct };

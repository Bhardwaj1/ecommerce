const ProductVariant = require("../models/productVariantModel");
const Product = require("../models/productModel");
const Volume = require("../models/volumeModel");
const asyncHandler = require("../utils/asyncHandler");

const createProductVariant = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { volume, price, stock } = req.body;

  if (!productId) {
    return res.status(400).json({
      success: false,
      error: "Product is required",
    });
  }

  if (!volume) {
    return res.status(400).json({
      success: false,
      error: "Volume is required",
    });
  }

  const existingVariant = await ProductVariant.findOne({
    product: productId,
    volume,
  });

  if (existingVariant) {
    return res.status(409).json({
      success: false,
      error: "Variant already exists",
    });
  }
  const productDetails = await Product.findById(productId);
  const volumeDetails = await Volume.findById(volume);
  let generatedSku = `${productDetails?.slug}-${volumeDetails?.name}`;

  const data = new ProductVariant({
    product: productId,
    volume,
    price,
    stock,
    sku: generatedSku.toUpperCase(),
  });

  await data.save();

  res.status(201).json({
    success: true,
    message: "Product Variant created successfully",
    productVariant: data,
  });
});
const getAllProductVariant = asyncHandler(async (req, res) => {
  let { search = "", perPage = 10, page = 1 } = req.query;
  perPage = Number(perPage);
  page = Number(page);

  let matchStage = search
    ? {
        $or: [
          {
            "product.name": {
              $regex: search,
              $options: "i",
            },
          },
          {
            sku: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      }
    : {};

  const variants = await ProductVariant.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $lookup: {
        from: "volumes",
        localField: "volume",
        foreignField: "_id",
        as: "volume",
      },
    },
    {
      $unwind: "$volume",
    },
    {
      $match: matchStage,
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $skip: (page - 1) * perPage,
    },
    {
      $limit: perPage,
    },
  ]);

  const totalRecords = await ProductVariant.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "product",
      },
    },
    {
      $unwind: "$product",
    },
    {
      $match: matchStage,
    },
    {
      $count: "total",
    },
  ]);

  const total = totalRecords[0]?.total || 0;

  const formattedProductVariants = variants.map((item) => ({
    _id: item?._id,
    sku: item?.sku,
    price: item?.price,
    stock: item?.stock,
    active: item?.active,
    product: {
      _id: item?.product?._id,
      name: item?.product?.name,
      slug: item?.product?.slug,
    },
    volume: {
      _id: item?.volume?._id,
      name: item?.volume?.name,
      valueInMl: item?.volume?.valueInMl,
    },
    createdAt: -1,
  }));

  res.status(200).json({
    success: true,
    message: "Product variants fetched successfully",
    data: formattedProductVariants,
    meta: {
      page,
      perPage,
      totalRecords: total,
      totalPages: Math.ceil(total / perPage),
    },
  });
});

const getVariantByProducts = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
  let variant = await ProductVariant.find({ product: productId })
    .populate({ path: "product", select: "name slug brand images" })
    .populate({ path: "volume", select: "name valueInMl" });

  res.status(200).json({
    success: true,
    message: "Product variants fetched successfully",
    data: variant,
  });
});

const updateProductVariant = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let updatedProductVariant = await ProductVariant.findByIdAndUpdate(
    id,
    req.body,
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  let formattedProductVariant = {
    _id: updatedProductVariant?._id,
    sku: updatedProductVariant?.sku,
    price: updatedProductVariant?.price,
    stock: updatedProductVariant?.stock,
    active: updatedProductVariant?.active,
    product: {
      _id: updatedProductVariant?.product?._id,
      name: updatedProductVariant?.product?.name,
      slug: updatedProductVariant?.product?.slug,
    },
    volume: {
      _id: updatedProductVariant?.volume?._id,
      name: updatedProductVariant?.volume?.name,
      valueInMl: updatedProductVariant?.volume?.valueInMl,
    },
  };
  res.status(200).json({
    success: true,
    message: "Product variant Updated successfully",
    productVariant: formattedProductVariant,
  });
});
const deleteProductVariant = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await ProductVariant.findByIdAndDelete(id);

  res.status(200).json({
    message: "Product variant deleted successfully",
    success: true,
  });
});

module.exports = {
  createProductVariant,
  getAllProductVariant,
  getVariantByProducts,
  updateProductVariant,
  deleteProductVariant,
};

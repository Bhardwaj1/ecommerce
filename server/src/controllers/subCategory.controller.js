const SubCategory = require("../models/subCategoryModel");
const subCategoryModel = require("../models/subCategoryModel");

const addSubCategory = async (req, res) => {
  try {
    const { name, description, active, parentCategory } = req.body;
    const duplicateSubCategory = await subCategoryModel.findOne({ name });

    if (duplicateSubCategory) {
      return res.status(409).json({
        success: false,
        error: "Sub category already exists",
      });
    }

    const subCategory = new subCategoryModel({
      name,
      description,
      active,
      parentCategory,
    });

    await subCategory.save();

    res.status(201).json({
      success: true,
      message: "Sub Caetgory created successfully",
      subCategory: subCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
const getAllSubCategory = async (req, res) => {
  try {
    let { search = "", perPage = 10, page = 1 } = req.query;
    page = Number(page);
    perPage = Number(perPage);

    const filter = {};
    if (search) {
      filter = {
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
    const totalRecords = await SubCategory.countDocuments(filter);
    const subCategories = await SubCategory.find(filter)
      .populate("parentCategory", "name description")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Sub Categories fetched successfully",
      data: subCategories,
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
const updateSubCategory = (req, res) => {};
const deleteSubCategory = () => {};

module.exports = {
  addSubCategory,
  getAllSubCategory,
  updateSubCategory,
  deleteSubCategory,
};

const Category = require("../models/categoryModel");
const SubCategory = require("../models/subCategoryModel");

const addCategory = async (req, res) => {
  try {
    const { name, description, active } = req.body;

    let checkDuplicateCategory = await Category.findOne({ name: name });
    if (checkDuplicateCategory) {
      return res.status(409).json({
        success: false,
        error: `${name} already exists`,
      });
    }
    const newCategory = new Category({
      name,
      description,
      active,
    });
    await newCategory.save();
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getAllCategory = async (req, res) => {
  try {
    let { search = "", page = 1, perPage = 10 } = req.query;

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
          {
            description: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      };
    }

    // Total Count
    const totalRecords = await Category.countDocuments(matchFilter);

    // pagination

    const categories = await Category.aggregate([
      {
        $match: matchFilter,
      },
      {
        $lookup: {
          from: "subcategories",
          localField: "_id",
          foreignField: "parentCategory",
          as: "subCategories",
        },
      },
      {
        $addFields: {
          totalSubCategories: {
            $size: "$subCategories",
          },
          activeSubCategories: {
            $size: {
              $filter: {
                input: "$subCategories",
                as: "sub",
                cond: {
                  $eq: ["$$sub.active", true],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          active: 1,
          totalSubCategories: 1,
          activeSubCategories: 1,
        },
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
    // let categories = await Category.find();
    res.status(200).json({
      success: true,
      data: categories,
      message: "Category fetched successfully",
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

const updateCategory = async (req, res) => {
  try {
    let { id } = req.params;
    let updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Category Updated Successfully",
      category: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const checkSubCategory = await SubCategory.findOne({ parentCategory: id });

    console.log(checkSubCategory);
    if (checkSubCategory) {
      return res.status(400).json({
        success: false,
        error: "Category already in use subcategory",
      });
    }
    await Category.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  addCategory,
  getAllCategory,
  deleteCategory,
  updateCategory,
};

const SubCategory = require("../models/subCategoryModel");

const addSubCategory = async (req, res) => {
  try {
    const { name, description, active, parentCategory } = req.body;
    const duplicateSubCategory = await SubCategory.findOne({ name });

    if (duplicateSubCategory) {
      return res.status(409).json({
        success: false,
        error: "Sub category already exists",
      });
    }

    const subCategory = new SubCategory({
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

    let matchFilter = {};
    const totalRecords = await SubCategory.countDocuments(matchFilter);
    const subCategories = await SubCategory.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "parentCategory",
          foreignField: "_id",
          as: "parentCategory",
        },
      },
      {
        $unwind: "$parentCategory",
      },
      {
        $project: {
          name: 1,
          description: 1,
          active: 1,
          parentCategory: {
            _id: "$parentCategory._id",
            name: "$parentCategory.name",
          },
        },
      },
      {
        $match: {
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
            {
              "parentCategory.name": {
                $regex: search,
                $options: "i",
              },
            },
          ],
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
const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    let subCategory = await SubCategory.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      message: "Subcategory updated successfully",
      subcategory: subCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await SubCategory.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Subcategory deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  addSubCategory,
  getAllSubCategory,
  updateSubCategory,
  deleteSubCategory,
};

const Category = require("../models/categoryModel");

const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    let checkDuplicateCategory = await Category.findOne({ name: name });
    if (checkDuplicateCategory) {
      return res.status(403).json({
        success: false,
        error: `${name} already exists`,
      });
    }
    const newCategory = new Category({
      name,
      description,
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
    let categories = await Category.find();
    res.status(200).json({
      success: true,
      data: categories,
      message: "Data fetched successfully",
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
      new: true,
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

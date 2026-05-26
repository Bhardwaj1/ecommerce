const express = require("express");
const {
  addSubCategory,
  getAllSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../controllers/subCategory.controller");

const route = express.Router();

route.post("/", addSubCategory);
route.get("/", getAllSubCategory);
route.put("/:id", updateSubCategory);
route.delete("/:id", deleteSubCategory);

module.exports = route;

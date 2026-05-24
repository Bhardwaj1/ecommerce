const express = require("express");
const {
  addSubCategory,
  getAllSubCategory,
} = require("../controllers/subCategory.controller");

const route = express.Router();

route.post("/", addSubCategory);
route.get("/", getAllSubCategory);

module.exports = route;

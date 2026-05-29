const express = require("express");
const {
  createBrand,
  getAllBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brand.controller");

const route = express.Router();

route.post("/", createBrand);
route.get("/", getAllBrand);
route.put("/:id", updateBrand);
route.delete("/", deleteBrand);

module.exports = route;

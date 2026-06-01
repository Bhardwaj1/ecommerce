const express = require("express");
const {
  createBrand,
  getAllBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brand.controller");
const upload = require("../middlewares/multer");

const route = express.Router();

route.post("/", upload.single("logo"), createBrand);
route.get("/", getAllBrand);
route.put("/:id", updateBrand);
route.delete("/", deleteBrand);

module.exports = route;

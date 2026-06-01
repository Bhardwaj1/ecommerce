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
route.put("/:id", upload.single("logo"), updateBrand);
route.delete("/:id", deleteBrand);

module.exports = route;

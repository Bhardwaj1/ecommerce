const express = require("express");
const { createProduct } = require("../controllers/product.controller");
const upload = require("../middlewares/multer");

const router = express.Router();

router.post("/", upload.array("images", 5), createProduct);

module.exports = router;

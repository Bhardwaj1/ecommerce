const express = require("express");
const {
  createProduct,
  updateProduct,
  getAllProduct,
  deleteProduct,
  getSingleProduct
} = require("../controllers/product.controller");
const upload = require("../middlewares/multer");

const router = express.Router();

router.post("/", upload.array("images", 5), createProduct);
router.get("/", getAllProduct);
router.get("/slug/:slug",getSingleProduct)
router.put("/:id", upload.array("images", 5), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;

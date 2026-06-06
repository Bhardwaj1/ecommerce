const express = require("express");

const router = express.Router();
const {
  createProductVariant,
  getAllProductVariant,
  updateProductVariant,
  deleteProductVariant,
  getVariantByProducts
} = require("../controllers/productVariant.controller");

router.post("/:productId/variant", createProductVariant);
router.get("/:productId/variants",getVariantByProducts);
router.get("/variants", getAllProductVariant);
router.put("/variants/:id", updateProductVariant);
router.delete("/:productId/variants/:id", deleteProductVariant);

module.exports = router;

const express = require("express");

const router = express.Router();
const {
  createProductVariant,
  getAllProductVariant,
  updateProductVariant,
  deleteProductVariant,
} = require("../controllers/productVariant.controller");

router.post("/:productId/variants", createProductVariant);
router.get("/variants", getAllProductVariant);
router.put("/variants/:id", updateProductVariant);
router.delete("/:productId/variants/:id", deleteProductVariant);

module.exports = router;

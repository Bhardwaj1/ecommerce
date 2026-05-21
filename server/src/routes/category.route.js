const express = require("express");

const router = express.Router();

const {
  addCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

router.post("/", addCategory);
router.get("/", getAllCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;

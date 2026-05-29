const express = require("express");
const {
  createVolume,
  getAllVolume,
  updateVolume,
  deleteVolume,
} = require("../controllers/volume.controller");
const upload = require("../middlewares/multer");

const router = express.Router();

router.post("/", upload.single("uploadedImage"), createVolume);
router.get("/", getAllVolume);
router.put("/:id", updateVolume);
router.delete("/:id", deleteVolume);

module.exports = router;

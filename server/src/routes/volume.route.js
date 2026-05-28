const express = require("express");
const {
  createVolume,
  getAllVolume,
} = require("../controllers/volume.controller");

const router = express.Router();

router.post("/", createVolume);
router.get("/", getAllVolume);

module.exports = router;

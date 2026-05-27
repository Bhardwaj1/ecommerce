const express = require("express");
const { createVolume } = require("../controllers/volume.controller");

const router = express.Router();

router.post("/", createVolume);

module.exports = router;

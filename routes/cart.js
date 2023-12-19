var express = require("express");
const { checkout } = require("../controllers/cartController");
var router = express.Router();
const multer = require("multer");
const fileUpload = multer();
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");


router.post("/checkout", checkout);

module.exports = router;

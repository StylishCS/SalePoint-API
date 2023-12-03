var express = require("express");
var router = express.Router();
const {
  addProductController,
  allProductsController,
  getProductByIdController,
} = require("../controllers/productsController");
const multer = require("multer");
const fileUpload = multer();

router.get("/", allProductsController);
router.get("/product/:id", getProductByIdController);
router.post("/addProduct",fileUpload.single("image"), addProductController);

module.exports = router;

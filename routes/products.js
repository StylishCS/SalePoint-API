var express = require("express");
var router = express.Router();
const {
  addProductController,
  allProductsController,
  getProductByIdController,
  deleteProductController,
  updateProductController
} = require("../controllers/productsController");
const multer = require("multer");
const fileUpload = multer();

router.get("/", allProductsController);
router.get("/product/:id", getProductByIdController);
router.post("/addProduct",fileUpload.single("image"), addProductController);
router.delete("/deleteProduct/:id", deleteProductController);
router.put("/updateProduct/:id", updateProductController);
module.exports = router;

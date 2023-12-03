const { nanoid } = require("nanoid");
const {
  addProduct,
  getProductById,
  getProducts,
} = require("../services/productServices");
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");

async function addProductController(req, res) {
  try {
    let nId = nanoid(10);
    let product;
    if (req.file) {
      let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          });
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };
      let result = await streamUpload(req);
      product = {
        name: req.body.name,
        netPrice: req.body.netPrice,
        sellPrice: req.body.sellPrice,
        stock: req.body.stock,
        category: req.body.category,
        id: nId,
        image: result.secure_url,
      };
    } else {
      product = {
        name: req.body.name,
        netPrice: req.body.netPrice,
        sellPrice: req.body.sellPrice,
        stock: req.body.stock,
        category: req.body.category,
        id: nId,
        image:
          "https://res.cloudinary.com/dl0ohmbko/image/upload/v1701613756/products/smsdqfaatoqjtpkevffc.png",
      };
    }
    await addProduct(product);
    return res.status(200).json(product);
  } catch (error) {
    console.log(error);
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function allProductsController(req, res) {
  try {
    let products = await getProducts();
    console.log(products);
    if (!products.length) return res.status(404).json("NO DATA FOUND");
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function getProductByIdController(req, res) {
  try {
    let product = await getProductById(req.params.id);
    if (!product) return res.status(404).json("NO DATA FOUND");
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

module.exports = {
  addProductController,
  allProductsController,
  getProductByIdController,
};

const { nanoid } = require("nanoid");
const {
  addProduct,
  getProductById,
  getProducts,
  updateProd,
  deleteProd,
} = require("../services/productServices");


async function checkout(req,res){
    try {
        
    } catch (error) {
        return res.status(500).json("INTERNAL SERVER ERROR");
    }
}

module.exports = {checkout};
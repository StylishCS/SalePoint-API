const { connection } = require("../db/dbConnection");
const util = require("util");

async function addProduct(data) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const product = await query("INSERT INTO products SET ?", [data]);
    return product;
  } catch (error) {
    console.error(error);
  }
}

async function getProducts() {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const products = await query("SELECT * FROM products");
    return products;
  } catch (error) {
    console.error(error);
  }
}

async function getProductById(id) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const products = await query("SELECT * FROM products WHERE id = ?", [id]);
    return products;
  } catch (error) {
    console.error(error);
  }
}

async function deleteProd(id){
  try {
    const query = util.promisify(connection.query).bind(connection);
    const product = await query("DELETE FROM products WHERE id = ?", [id]);
    return product;
  } catch (error) {
    console.error(error);
  }
}

async function updateProd(id, data){
  try {
    const query = util.promisify(connection.query).bind(connection);
    const product = await query("UPDATE products SET ? WHERE id = ?", [data, id]);
    return product;
  } catch (error) {
    console.error(error);
  }
}

// async function updateStock(id, data){
//   try {
//     const query = util.promisify(connection.query).bind(connection);
//     const product = await query("UPDATE products SET ? WHERE id = ?", [data, id]);
//   } catch (error) {
//     console.log(error);
//   }
// }


module.exports = {
  addProduct,
  getProducts,
  getProductById,
  deleteProd,
  updateProd,
};

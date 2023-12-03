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
    const products = await query("SELECT * FROM products WHERE id = ?", id);
    return products;
  } catch (error) {
    console.error(error);
  }
}


module.exports = { addProduct, getProducts, getProductById };

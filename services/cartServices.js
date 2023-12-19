const { connection } = require("../db/dbConnection");
const util = require("util");

async function createInvoice(data, products, url) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const invoice = await query("INSERT INTO invoices SET ?", [data]);
    products.forEach(async (product) => {
      await query("INSERT INTO invoiceproducts SET ?", {
        invoiceId: data.id,
        productId: product.id,
        quantity: product.quantity,
      });
    });
    return invoice;
  } catch (error) {
    console.error(error);
  }
}



module.exports = { createInvoice };

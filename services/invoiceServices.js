const { connection } = require("../db/dbConnection");
const util = require("util");
async function getInvoice(id) {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const invoice = await query("SELECT * FROM invoices WHERE id = ?", [id]);
    return invoice;
  } catch (error) {
    console.error(error);
  }
}

async function getInvoices() {
  try {
    const query = util.promisify(connection.query).bind(connection);
    const invoices = await query("SELECT * FROM invoices");
    return invoices;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {getInvoice, getInvoices}

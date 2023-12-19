const path = require("path");
const fs = require("fs");
const { getInvoice, getInvoices } = require("../services/invoiceServices");

async function getInvoicePDF(req, res) {
  try {
    console.log(path.join(__dirname, "invoice", `${req.params.id}.pdf`));
    return res.status(200).json({ path: path.join(__dirname, "invoice", `${req.params.id}.pdf`) });
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

async function getAllInvoice(req, res) {
  try {
    let invoices = await getInvoices();
    if (!invoices[0]) {
      return res.status(404).json("NO DATA FOUND");
    }
    return res.status(200).json(invoices);
  } catch (error) {
    return res.status(500).json("INTERNAL SERVER ERROR");
  }
}

module.exports = { getAllInvoice, getInvoicePDF };

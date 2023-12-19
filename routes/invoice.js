var express = require("express");
var router = express.Router();

const {getAllInvoice,getInvoicePDF} = require("../controllers/invoiceController");

/* GET home page. */
router.get("/allInvoices", getAllInvoice);
router.get("/invoicePDF/:id", getInvoicePDF);

module.exports = router;

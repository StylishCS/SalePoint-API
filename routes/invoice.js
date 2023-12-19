var express = require("express");
var router = express.Router();

const {getAllInvoice} = require("../controllers/invoiceController");

/* GET home page. */
router.get("/allInvoices", getAllInvoice);

module.exports = router;

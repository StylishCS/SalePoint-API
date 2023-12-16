var express = require("express");
const { checkout } = require("../controllers/cartController");
var router = express.Router();

router.get("/checkout", checkout);

module.exports = router;

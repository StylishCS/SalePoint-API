var express = require('express');
var router = express.Router();
const {loginController} = require("../controllers/userController");

router.post("/login", loginController);

module.exports = router;

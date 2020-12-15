var express = require("express");
const router = express.Router();
var user = require("../controllers/usersController.js");


router.route("/").post(user.registerUser);

module.exports = router;
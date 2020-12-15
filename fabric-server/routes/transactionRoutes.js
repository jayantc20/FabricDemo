var express = require("express");
const router = express.Router();
var transaction = require("../controllers/transactionController.js");
var protect = require("../middleware/authMiddleware.js");

router
  .route("/channels/:channelName/chaincodes/:chaincodeName")
  .post(protect, transaction.invokeTransaction);

router
  .route("/channels/:channelName/chaincodes/:chaincodeName")
  .get(protect, transaction.queryTransaction);

module.exports = router;

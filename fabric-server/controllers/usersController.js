
var async = require("../utils/asyncMiddleware.js");
var helper = require("../modules/helper.js");
var Token = require("../utils/generateToken.js");

const registerUser = async.asyncMiddleware(async (req, res) => {
  const { username, orgName } = req.body;

  const response = await helper.getRegisteredUser(username, orgName, true);

  if (response && typeof response !== "string" && response.success) {
    const token = Token.generateToken(username, orgName);
    response.token = token;
    res.status(201).json(response);
  } else {
    res.status(400);
    // res.status(400).json({success: false, message: response});
    throw new Error({ success: false, message: response });
  }
});

exports.registerUser = registerUser;

var jwt = require("jsonwebtoken");

const generateToken = (username, orgName) => {
  return jwt.sign({ username, orgName }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

exports.generateToken = generateToken;

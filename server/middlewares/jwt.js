const jwt = require("jsonwebtoken");
require("dotenv").config();
const generateAccessToken = (uid, role) => {
  return jwt.sign({ _id: uid, role: role }, process.env.JWT_SECRET, {
    expiresIn: "1m",
  });
};
const generateRefreshToken = (uid, role) => {
  return jwt.sign({ _id: uid, role: role }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });
};
module.exports = { generateAccessToken, generateRefreshToken };

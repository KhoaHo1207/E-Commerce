const jwt = require("jsonwebtoken");
require("dotenv").config();
const generateAccessToken = (uid, role) => {
  return jwt.sign({ _id: uid, role: role }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};
const generateRefreshToken = (uid, role) => {
  return jwt.sign({ _id: uid, role: role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
module.exports = { generateAccessToken, generateRefreshToken };

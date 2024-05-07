const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const verifyAccessToken = asyncHandler(async (req, res, next) => {
  //Bearer token
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).json({
          //loi khong xac thuc -> ben FE gui lai yeu cau cap accessToken
          success: false,
          mes: "Invalid access token",
        });
      }
      console.log(decode);
      req.user = decode;
      next();
    });
  } //check coi co bat dau bang Bearer khong
  else {
    return res.status(401).json({
      success: false,
      mes: "Require authentication!!!",
    });
  }
});

module.exports = {
  verifyAccessToken,
};

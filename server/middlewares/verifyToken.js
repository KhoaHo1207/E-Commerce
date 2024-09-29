//dùng để verify Token mà client gửi lên

const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
require("dotenv").config();
const verifyAccessToken = asyncHandler(async (req, res, next) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req.headers.authorization.split(" ")[1]; //tại vì gửi lên là Bearer iuasgiusgiufcgsi -> xóa khoảng cách headers: {authorization: "Bearer token"}
    try {
      jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
        //trả về thêm call back
        if (err) {
          //nếu ko có lỗi thì null
          return res
            .status(403)
            .json({ success: false, message: "Invalid token" });
        }
        console.log(decode); //đưa thông tin decode vào req.user để dùng cho các route sau này
        req.user = decode;
        next(); //next qua hàm mới
      });
    } catch (error) {
      res.status(401).json({ success: false, message: "Invalid token" });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "Require authentication!!!",
    });
  } //nếu không phải bắt đầu bằng Bearer thì k phải token dùng để xác thực
});
module.exports = { verifyAccessToken };

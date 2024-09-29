const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname, mobile } = req.body;
  if (!email || !password || !firstname || !lastname || !mobile) {
    return res.status(400).json({ success: false, message: "Missing input!" });
  }
  const user = await User.findOne({ email: email });
  if (user) {
    return res.status(409).json({
      success: false,
      message: "User has already existed!",
    });
  } else if (!user) {
    const newUser = await User.create(req.body);
    return res.status(200).json({
      sucess: newUser ? true : false,
      message: newUser ? "Register successfuly!" : "Register failed!",
    });
  } else {
    throw new Error("Server error");
  }
});
//Refresh Token => cap moi access Token
//Access Token => xác thực người dùng, phân quyền
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Missing input!" });
  }
  const response = await User.findOne({ email: email }); //reponse cua findone tra ve khong phai object thuan ma la 1 plain object
  if (response && (await response.isCorrectPassword(password))) {
    //tạo refreshtoken vào cookie còn accesstoken tra vê cho người dùng
    const { password, role, ...userData } = response.toObject(); //chuyển sang object thuần
    const accessToken = generateAccessToken(response._id, role);
    const refreshToken = generateRefreshToken(response._id, role); //không trả về token -> lưu trong cookie
    await User.findByIdAndUpdate(
      response._id,
      { refreshToken: refreshToken },
      { new: true }
    ); //lưu refresh token vào db, new: true có nghĩa sẽ trả về data sau update, false trả về data trước update
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }); //lưu refreshToken vào cookie, chỉ chấp nhận đầu http, maxAge don vi la ms
    return res.status(200).json({
      success: true,
      message: "Login successfuly!",
      accessToken: accessToken,
      payload: userData,
    });
  } else if (response && !(await response.isCorrectPassword(password))) {
    return res.status(400).json({
      success: false,
      message: "Invalid password!",
    });
  } else {
    throw new Error("Server error: ");
  }
});
const getCurrent = async (req, res) => {
  const { _id } = req.user; //lấy từ decode -> có _id, role
  const user = await User.findById(_id).select("-refreshToken -password -role");
  return res.status(200).json({
    success: true,
    payload: user ? user : "User not found!",
  });
};
const refreshAccessToken = asyncHandler(async (req, res) => {
  //Lấy refreshToken từ cookie
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: "Not authorized!" });
  }
  jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });
    } else {
      const response = await User.findOne({
        _id: decode._id,
        refreshToken: refreshToken,
      });
      return res.status(200).json({
        success: response ? true : false,
        message: response
          ? "Refresh token successfuly!"
          : "Refresh token failed!",
        accessToken: response
          ? generateAccessToken(response._id, response.role)
          : "Refresh token failed!",
      });
    }
  });
});
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken) {
    return res.status(401).json({ success: false, message: "Not authorized!" });
  } else {
    await User.findOneAndUpdate(
      { refreshToken: cookie.refreshToken }, //tìm đúng refresh token đó
      { refreshToken: null }, //xóa refreshToken
      { new: true } //nhận bản sau update
    );
    res.clearCookie("refreshToken", {
      httpOnly: true, //Thuộc tính httpOnly chỉ ra rằng cookie chỉ có thể được truy cập bởi máy chủ, và không thể được truy cập hoặc sửa đổi bởi JavaScript trên trình duyệt.
      path: "/",
      secure: true, //huộc tính secure yêu cầu cookie chỉ được gửi qua kết nối HTTPS. Điều này giúp bảo vệ thông tin cookie không bị rò rỉ trên các kết nối HTTP không an toàn.
      maxAge: 0, //Điều này có nghĩa là cookie sẽ được xóa ngay khi lệnh này được thực thi. Trình duyệt sẽ tự động xóa cookie khi nhận được yêu cầu này từ máy chủ.
    }); //xóa refreshToken từ cookie
    return res
      .status(200)
      .json({ success: true, message: "Logout successfuly!" });
  }
});
module.exports = {
  register,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
};

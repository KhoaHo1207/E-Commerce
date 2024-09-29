const User = require("../models/user");
const asyncHandler = require("express-async-handler");
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
    return res.status(401).json({
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
module.exports = {
  register,
  login,
  getCurrent,
};

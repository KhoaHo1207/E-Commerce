const User = require("../models/user");
const asyncHandler = require("express-async-handler");

const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname, mobile } = req.body;
  if (!email || !password || !firstname || !lastname || !mobile) {
    return res.status(400).json({ success: false, message: "Missing input!" });
  }
  const user = await User.findOne({ email: email });
  if (user) {
    throw new Error("User has already existed!");
  } else {
    const newUser = await User.create(req.body);
    return res.status(200).json({
      sucess: newUser ? true : false,
      message: newUser ? "Register successfuly!" : "Register failed!",
    });
  }
});
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Missing input!" });
  }
  const response = await User.findOne({ email: email }); //reponse cua findone tra ve khong phai object thuan ma la 1 plain object
  if (response && (await response.isCorrectPassword(password))) {
    //tạo refreshtoken vào cookie còn accesstoken tra vê cho người dùng
    const { password, role, ...userData } = response.toObject(); //chuyển sang object thuần
    return res.status(200).json({
      success: true,
      message: "Login successfuly!",
      payload: userData,
    });
  } else if (response && !(await response.isCorrectPassword(password))) {
    return res.status(401).json({
      success: false,
      message: "Invalid password!",
    });
  } else {
    throw new Error("Server error: " + response);
  }
});

module.exports = {
  register,
  login,
};

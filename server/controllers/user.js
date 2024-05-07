const User = require("../models/user");
const asyncHandler = require("express-async-handler");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");

const jwt = require("jsonwebtoken");
const register = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({
      success: false,
      mes: "Missing input",
    });
  }

  const user = await User.findOne({ email });
  if (user) throw new Error("User is already exited");
  else {
    const newUser = await User.create(req.body);
    return res.status(200).json({
      success: true,
      response: newUser
        ? "Register successfully. PLease go login..."
        : "Something went wrong",
    });
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      mes: "Missing input",
    });
  }

  const response = await User.findOne({ email });
  if (response && (await response.isCorrectPassword(password))) {
    //tách password va role ra khoi response
    const { password, role, ...userData } = response.toObject();
    //tao access token
    const accessToken = generateAccessToken(response._id, role);
    //tao refresh token
    const refreshToken = generateRefreshToken(response._id);
    //luu refresh vao database
    await User.findByIdAndUpdate(response._id, { refreshToken }, { new: true }); //true -> tra ve data sau update
    //luu refresh vao cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }); //chi cho phep dau http truye cap vao
    return res.status(200).json({
      success: true,
      accessToken,
      // refreshToken, không trả về, lưu dưới cookie
      userData,
    });
  } else {
    throw new Error("Invalid credentials");
  }
});

const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select("-refreshToken -password -role");
  // console.log("_id", typeof id);
  return res.status(200).json({
    success: user ? true : false,
    rs: user ? user : "User not found",
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  //Lấy token từ cookie
  const cookie = req.cookies; //trả về object
  //Check xem có refresh token hay ko
  if (!cookie && !cookie.refreshToken)
    throw new Error("No refresh token in cookies");
  //check token co hop le ko
  // jwt.verify(
  //   cookie.refreshToken,
  //   process.env.JWT_SECRET,
  //   async (err, decode) => {
  //     if (err) throw new Error("Invalid refresh token");
  //     const response = await User.findOne({
  //       _id: decode._id,
  //       refreshToken: cookie.refreshToken,
  //     });
  //     return res.status(200).json({
  //       success: response ? true : false,
  //       newAccessToken: response
  //         ? generateAccessToken(response._id, response.role)
  //         : "Refresh token not matched",
  //     });
  //   }
  // );
  const rs = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
  const response = await User.findOne({
    _id: rs._id,
    refreshToken: cookie.refreshToken,
  });
  return res.status(200).json({
    success: response ? true : false,
    newAccessToken: response
      ? generateAccessToken(response._id, response.role)
      : "Refresh token not matched",
  });
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie.refreshToken)
    throw new Error("No refresh token in cookies");
  //xoa token o db
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  //xoa refresh token o trinh duyet
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.status(200).json({
    success: true,
    mes: "Logout successfully",
  });
});
module.exports = { register, login, getCurrent, refreshAccessToken, logout };

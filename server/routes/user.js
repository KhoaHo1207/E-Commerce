const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getCurrent,
  refreshAccessToken,
  logout,
} = require("../controller/user");
const { verifyAccessToken } = require("../middlewares/verifyToken");
router.post("/register", register);
router.get("/login", login);
router.get("/current", verifyAccessToken, getCurrent); //verifyAccessToken có next -> chạy qua getCurrent
router.post("/refreshtoken", refreshAccessToken);
router.get("/logout", logout);
module.exports = router;

const express = require("express");
const router = express.Router();
const { register, login, getCurrent } = require("../controller/user");
const { verifyAccessToken } = require("../middlewares/verifyToken");
router.post("/register", register);
router.get("/login", login);
router.get("/current", verifyAccessToken, getCurrent); //verifyAccessToken có next -> chạy qua getCurrent
module.exports = router;

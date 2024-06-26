const express = require("express");
require("dotenv").config();

const dbConnect = require("./config/dbconnect");
const initRoutes = require("./routes");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
const port = process.env.PORT || 8080;
app.use(express.json()); //app đọc file json
app.use(express.urlencoded({ extended: true })); //đọc các file dạng khác

dbConnect();
initRoutes(app);
app.use("/", (req, res) => {
  res.send("Server on");
});

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});

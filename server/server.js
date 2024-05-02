const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 8080;
app.use(express.json()); //app đọc file json
app.use(express.urlencoded({ extended: true })); //đọc các file dạng khác

app.use("/", (req, res) => {
  res.send("Server on");
});

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});

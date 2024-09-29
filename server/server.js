const express = require("express");
require("dotenv").config();
const dbConnect = require("./config/dbconnect");
const app = express();
const port = process.env.PORT || 8080;
const initRoutes = require("./routes");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json()); //express đọc hiểu file json gửi lên từ client
app.use(express.urlencoded({ extended: true })); //gửi các định dạng khác như object, string,...

dbConnect();
initRoutes(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // Khi bạn gọi app.listen(), ứng dụng của bạn sẽ bắt đầu lắng nghe các kết nối đến từ các client trên một địa chỉ và cổng mà bạn đã chỉ định.
});

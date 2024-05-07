const { default: mongoose } = require("mongoose");

const dbConnect = async () => {
  //1
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URl); //tim đến đường dẫn kết nối db
    if (conn.connection.readyState === 1) {
      console.log("DB Connection is successfully");
    } else console.log("DB Connection is failed");
  } catch (err) {
    console.log("DB Connect Failed");
    throw new Error(err); //khi gặp dòng này code sẽ dừng tại đây
  }
};

module.exports = dbConnect;

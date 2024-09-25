const { default: mongoose, mongo } = require("mongoose");
mongoose.set("strictQuery", false);
const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    if (conn.connection.readyState === 1) {
      console.log("Connected to MongDB");
    } else {
      console.log("Failed to connect to MongDB");
    }
  } catch (error) {
    console.log("DB connect failed!");
    throw new Error(error);
  }
};

module.exports = dbConnect;

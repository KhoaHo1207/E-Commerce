//go tat: !mdbgum
const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, //không trùng
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    cart: {
      type: Array,
      default: [],
    },
    address: [{ type: mongoose.Types.ObjectId, ref: "Address" }],
    wishlist: [{ type: mongoose.Types.ObjectId, ref: "Product" }], //tham chiếu đền bảng Product
    isBlocked: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    passwordChangedAt: {
      type: String,
    }, //dung cho quen mat khau, reset mat khau
    passwordResetToken: {
      typer: String,
    },
    passwordResetExpired: {
      type: String,
    },
  },
  { timestamps: true } //thời gian chạy theo kieu timestamp
);

userSchema.pre("save", async function (next) {
  //save: hàm nào save mới chắc vô đây
  if (!this.isModified("password")) {
    //password khong thay doi -> out
    next();
  }
  const salt = bcrypt.genSaltSync(10); //tạo muối, mả hóa không cho người ta hiểu đc cách mình mã hóa, đồng bộ
  this.password = await bcrypt.hash(this.password, salt); //lấy passwor muốn lưu -> mã hóa
}); //trước khi lưu thưc hiện code trong đây

userSchema.methods = {
  isCorrectPassword: async function (password) {
    return await bcrypt.compare(password, this.password);
  },
};
//Export the model
module.exports = mongoose.model("User", userSchema);

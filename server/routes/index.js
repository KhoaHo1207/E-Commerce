const userRouter = require("./user");
const { notFound, errhandler } = require("../middlewares/errHandler");
const initRoutes = (app) => {
  app.use("/api/user", userRouter);

  //chạy từ trên xuong dưới nếu không có route nào trùng thì chạy vào đây
  app.use(notFound);
  app.use(errhandler);
};

module.exports = initRoutes;

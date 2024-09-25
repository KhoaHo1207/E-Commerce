const userRouter = require("./user");
const { errHandler, notFound } = require("../middlewares/errorHandler");
const initRoutes = (app) => {
  //api chạy từ trển xuống, không có thì chạy vô notFound
  app.use("/api/user", userRouter);
  app.use(notFound);
  app.use(errHandler);
};

module.exports = initRoutes;

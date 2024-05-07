const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  res.status(404);
  next();
};

const errhandler = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; //loi DB
  return res.status(statusCode).json({
    success: false,
    mes: error?.message,
  });
};

module.exports = {
  notFound,
  errhandler,
};

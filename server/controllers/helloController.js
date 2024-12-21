const { StatusCodes } = require("http-status-codes");

const sayHello = (req, res) => {
  return res.status(StatusCodes.OK).json({
    message: "Hello World",
  });
};

module.exports = {
  sayHello,
};

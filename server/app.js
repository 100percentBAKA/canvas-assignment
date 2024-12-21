const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// ! middleware
app.use(bodyParser.json());

// ! imports
const helloRouter = require("./routes/helloRoute");
const canvasRouter = require("./routes/canvasRoute");
const errorHandlerMiddleware = require("./middlewares/errorhandler");

// ! routes
app.use("/hello", helloRouter);
app.use("/canvas", canvasRouter);

// ! middlewares
app.use(errorHandlerMiddleware);

module.exports = app;

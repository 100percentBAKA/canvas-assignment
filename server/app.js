const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

// ! middleware
app.use(bodyParser.json());

// ! route imports
const helloRouter = require("./routes/helloRoute");

// ! routes
app.use("/hello", helloRouter);

module.exports = app;

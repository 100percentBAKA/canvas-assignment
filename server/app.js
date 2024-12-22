const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");

// ! swagger
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const app = express();

// ! middleware
app.use(bodyParser.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://canvas-11.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
  })
);

// ! imports
const helloRouter = require("./routes/helloRoute");
const canvasRouter = require("./routes/canvasRoute");
const errorHandlerMiddleware = require("./middlewares/errorhandler");

// ! routes
app.use("/hello", helloRouter);
app.use("/canvas", canvasRouter);

// ! middlewares
app.use(errorHandlerMiddleware);

// ! swagger setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CANVAS ASSIGNMENT",
      version: "1.0.0",
      description: "CANVAS ASSIGNMENT",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

module.exports = app;

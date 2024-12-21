const { StatusCodes } = require("http-status-codes");
const fs = require("fs");
const path = require("path");
const { createCanvas } = require("canvas");

let canvas;
let context;

const drawCanvas = (req, res) => {
  const { width, height } = req.body;

  if (!width || !height) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Width and height are required." });
  }

  canvas = createCanvas(width, height);
  context = canvas.getContext("2d");

  context.fillStyle = "white";
  context.fillRect(0, 0, width, height);

  res
    .status(StatusCodes.OK)
    .json({ message: "Canvas initialized", width, height });
};

const drawText = (req, res) => {
  const { text, x, y, fontSize, color } = req.body;

  if (!context) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Canvas is not initialized." });
  }

  if (!text || x == null || y == null) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Text, x, and y are required." });
  }

  context.fillStyle = color || "black";
  context.font = `${fontSize || 20}px sans-serif`;
  context.fillText(text, x, y);

  res.status(StatusCodes.OK).json({ message: "Text added to canvas." });
};

const drawElement = (req, res) => {
  const { type, x, y, width, height, radius, text, color } = req.body;

  if (!context) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Canvas is not initialized." });
  }

  context.fillStyle = color || "black";

  if (type === "rectangle") {
    if (!width || !height) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Width and height are required for rectangles." });
    }
    context.fillRect(x, y, width, height);
  } else if (type === "circle") {
    if (!radius) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Radius is required for circles." });
    }
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  } else if (type === "text") {
    if (!text) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Text is required for text elements." });
    }
    context.fillText(text, x, y);
  } else {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid type. Must be rectangle, circle, or text." });
  }

  res.status(StatusCodes.OK).json({ message: "Element added successfully." });
};

const exportCanvas = (req, res) => {
  if (!canvas) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Canvas is not initialized." });
  }

  const downloadsDir = path.join(__dirname, "downloads");
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir);
  }

  const filePath = path.join(downloadsDir, "canvas.html");
  const svgData = canvas.toDataURL();
  const htmlContent = `<html><body><img src='${svgData}' /></body></html>`;

  fs.writeFile(filePath, htmlContent, (err) => {
    if (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Failed to export canvas." });
    }

    console.log("Canvas exported successfully.");
    res
      .status(StatusCodes.OK)
      .json({ message: "Canvas exported successfully.", filePath });
  });
};

const canvasDownload = (req, res) => {
  if (!canvas) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Canvas is not initialized." });
  }

  const downloadsDir = path.join(__dirname, "downloads");
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir);
  }

  const filePath = path.join(downloadsDir, "canvas.png");
  const buffer = canvas.toBuffer("image/png");

  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Failed to save canvas as PNG." });
    }

    res.download(filePath, "canvas.png", (err) => {
      if (err) {
        console.error("Error during file download:", err);
      }
    });
  });
};

module.exports = {
  drawCanvas,
  drawText,
  drawElement,
  exportCanvas,
  canvasDownload,
};

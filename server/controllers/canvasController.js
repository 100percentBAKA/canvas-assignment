const { StatusCodes } = require("http-status-codes");
const fs = require("fs");
const path = require("path");
const { createCanvas } = require("canvas");
const eventEmitter = require("../utils/eventEmitter");

let canvas;
let context;
let drawingCommands = [];

const drawCanvas = (req, res) => {
  const { width, height } = req.body;

  if (!width || !height) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Width and height are required" });
  }

  canvas = createCanvas(width, height);
  context = canvas.getContext("2d");
  drawingCommands = [];

  context.fillStyle = "white";
  context.fillRect(0, 0, width, height);
  drawingCommands.push({
    type: "rect",
    x: 0,
    y: 0,
    width,
    height,
    fill: "white",
  });

  res
    .status(StatusCodes.OK)
    .json({ message: "Canvas initialized", width, height });
};

const drawText = (req, res) => {
  const { text, x, y, fontSize = 20, color = "black" } = req.body;

  if (!context) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Canvas is not initialized" });
  }

  if (!text || x == null || y == null) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Text, x, and y are required" });
  }

  context.fillStyle = color;
  context.font = `${fontSize}px sans-serif`;
  context.fillText(text, x, y);

  drawingCommands.push({
    type: "text",
    text,
    x,
    y,
    fontSize,
    fill: color,
    fontFamily: "sans-serif",
  });

  res.status(StatusCodes.OK).json({ message: "Text added to canvas" });
};

const drawElement = (req, res) => {
  const { type, x, y, width, height, radius, color = "black" } = req.body;

  if (!context) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Canvas is not initialized" });
  }

  context.fillStyle = color;

  if (type === "rectangle") {
    if (!width || !height) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Width and height are required for rectangles" });
    }
    context.fillRect(x, y, width, height);
    drawingCommands.push({
      type: "rect",
      x,
      y,
      width,
      height,
      fill: color,
    });
  } else if (type === "circle") {
    if (!radius) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Radius is required for circles" });
    }
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
    drawingCommands.push({
      type: "circle",
      cx: x,
      cy: y,
      r: radius,
      fill: color,
    });
  } else {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid type. Must be rectangle or circle" });
  }

  res.status(StatusCodes.OK).json({ message: "Element added successfully" });
};

const generateVectorSVG = (commands, width, height) => {
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;

  for (const cmd of commands) {
    switch (cmd.type) {
      case "rect":
        svg += `<rect x="${cmd.x}" y="${cmd.y}" width="${cmd.width}" height="${cmd.height}" fill="${cmd.fill}"/>`;
        break;
      case "circle":
        svg += `<circle cx="${cmd.cx}" cy="${cmd.cy}" r="${cmd.r}" fill="${cmd.fill}"/>`;
        break;
      case "text":
        svg += `<text x="${cmd.x}" y="${cmd.y}" font-family="${cmd.fontFamily}" font-size="${cmd.fontSize}px" fill="${cmd.fill}">${cmd.text}</text>`;
        break;
    }
  }

  svg += "</svg>";
  return svg;
};

const exportCanvasHTML = (req, res) => {
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
        .json({ error: "Failed to export canvas" });
    }

    eventEmitter.emit("export", "HTML", filePath);

    res.download(filePath, "canvas.html", (err) => {
      if (err) {
        console.error("Error during file download:", err);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "Failed to download HTML file" });
      }

      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr)
          console.error("Error deleting temporary file:", unlinkErr);
      });
    });
  });
};

const exportCanvasSVG = (req, res) => {
  if (!canvas) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Canvas is not initialized" });
  }

  const downloadsDir = path.join(__dirname, "downloads");
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir);
  }

  const svgContent = generateVectorSVG(
    drawingCommands,
    canvas.width,
    canvas.height
  );
  const filePath = path.join(downloadsDir, "canvas.svg");

  fs.writeFile(filePath, svgContent, (err) => {
    if (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Failed to export canvas as SVG" });
    }

    eventEmitter.emit("export", "SVG", filePath);

    res.download(filePath, "canvas.svg", (err) => {
      if (err) {
        console.error("Error during file download:", err);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "Failed to download SVG file" });
      }

      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr)
          console.error("Error deleting temporary file:", unlinkErr);
      });
    });
  });
};

const canvasDownload = (req, res) => {
  if (!canvas) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Canvas is not initialized" });
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
        .json({ error: "Failed to save canvas as PNG" });
    }

    eventEmitter.emit("export", "PNG", filePath);

    res.download(filePath, "canvas.png", (err) => {
      if (err) {
        console.error("Error during file download:", err);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "Failed to download PNG file" });
      }

      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr)
          console.error("Error deleting temporary file:", unlinkErr);
      });
    });
  });
};

module.exports = {
  drawCanvas,
  drawText,
  drawElement,
  exportCanvasHTML,
  exportCanvasSVG,
  canvasDownload,
};

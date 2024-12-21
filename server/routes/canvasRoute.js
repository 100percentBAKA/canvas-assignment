const express = require("express");
const router = express.Router();
const {
  drawCanvas,
  drawElement,
  drawText,
  exportCanvas,
  canvasDownload,
} = require("../controllers/canvasController");

router.post("/draw-canvas", drawCanvas);
router.post("/draw-element", drawElement);
router.post("/draw-text", drawText);
router.get("/export-canvas", exportCanvas);
router.get("/canvas-download", canvasDownload);

module.exports = router;

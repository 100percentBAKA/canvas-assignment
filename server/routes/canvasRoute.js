/**
 * @swagger
 * /canvas/draw-canvas:
 *   post:
 *     summary: Initialize a new canvas
 *     description: Creates a canvas with the specified width and height.
 *     tags:
 *       - Canvas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               width:
 *                 type: integer
 *                 description: The width of the canvas
 *                 example: 800
 *               height:
 *                 type: integer
 *                 description: The height of the canvas
 *                 example: 600
 *     responses:
 *       200:
 *         description: Canvas initialized successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Canvas initialized
 *                 width:
 *                   type: integer
 *                   example: 800
 *                 height:
 *                   type: integer
 *                   example: 600
 *       400:
 *         description: Missing width or height
 */

/**
 * @swagger
 * /canvas/draw-text:
 *   post:
 *     summary: Add text to the canvas
 *     description: Draws text on the canvas at the specified coordinates.
 *     tags:
 *       - Canvas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The text to draw
 *                 example: Hello, world!
 *               x:
 *                 type: integer
 *                 description: The x-coordinate for the text
 *                 example: 100
 *               y:
 *                 type: integer
 *                 description: The y-coordinate for the text
 *                 example: 100
 *               fontSize:
 *                 type: integer
 *                 description: Font size (optional)
 *                 example: 20
 *               color:
 *                 type: string
 *                 description: Text color (optional)
 *                 example: black
 *     responses:
 *       200:
 *         description: Text added to canvas
 *       400:
 *         description: Canvas not initialized or missing parameters
 */

/**
 * @swagger
 * /canvas/draw-element:
 *   post:
 *     summary: Draw an element on the canvas
 *     description: Draws a rectangle, circle, or text on the canvas.
 *     tags:
 *       - Canvas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: The type of element to draw (rectangle, circle, text)
 *                 example: rectangle
 *               x:
 *                 type: integer
 *                 description: The x-coordinate
 *                 example: 100
 *               y:
 *                 type: integer
 *                 description: The y-coordinate
 *                 example: 100
 *               width:
 *                 type: integer
 *                 description: The width (required for rectangle)
 *                 example: 200
 *               height:
 *                 type: integer
 *                 description: The height (required for rectangle)
 *                 example: 100
 *               radius:
 *                 type: integer
 *                 description: The radius (required for circle)
 *                 example: 50
 *               color:
 *                 type: string
 *                 description: The color of the element
 *                 example: blue
 *     responses:
 *       200:
 *         description: Element added successfully
 *       400:
 *         description: Canvas not initialized or invalid parameters
 */

/**
 * @swagger
 * /canvas/export-canvas:
 *   get:
 *     summary: Export the canvas as an HTML file
 *     description: Exports the current canvas as an HTML file containing an image of the canvas.
 *     tags:
 *       - Canvas
 *     responses:
 *       200:
 *         description: Canvas exported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Canvas exported successfully
 *                 filePath:
 *                   type: string
 *                   example: /path/to/canvas.html
 *       400:
 *         description: Canvas not initialized
 *       500:
 *         description: Failed to export canvas
 */

/**
 * @swagger
 * /canvas/canvas-download:
 *   get:
 *     summary: Download the canvas as a PNG file
 *     description: Exports the current canvas as a PNG image file for download.
 *     tags:
 *       - Canvas
 *     responses:
 *       200:
 *         description: PNG file ready for download
 *       400:
 *         description: Canvas not initialized
 *       500:
 *         description: Failed to save canvas as PNG
 */
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

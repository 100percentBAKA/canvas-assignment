const express = require("express");
const router = express.Router();
const canvasController = require("../controllers/canvasController");

/**
 * @swagger
 * components:
 *   schemas:
 *     DrawCanvas:
 *       type: object
 *       required:
 *         - width
 *         - height
 *       properties:
 *         width:
 *           type: number
 *           description: The width of the canvas
 *         height:
 *           type: number
 *           description: The height of the canvas
 *     DrawText:
 *       type: object
 *       required:
 *         - text
 *         - x
 *         - y
 *       properties:
 *         text:
 *           type: string
 *           description: The text to draw
 *         x:
 *           type: number
 *           description: X coordinate
 *         y:
 *           type: number
 *           description: Y coordinate
 *         fontSize:
 *           type: number
 *           description: Font size in pixels
 *           default: 20
 *         color:
 *           type: string
 *           description: Text color
 *           default: "black"
 *     DrawElement:
 *       type: object
 *       required:
 *         - type
 *         - x
 *         - y
 *       properties:
 *         type:
 *           type: string
 *           enum: [rectangle, circle]
 *           description: Type of shape to draw
 *         x:
 *           type: number
 *           description: X coordinate
 *         y:
 *           type: number
 *           description: Y coordinate
 *         width:
 *           type: number
 *           description: Width (required for rectangle)
 *         height:
 *           type: number
 *           description: Height (required for rectangle)
 *         radius:
 *           type: number
 *           description: Radius (required for circle)
 *         color:
 *           type: string
 *           description: Shape color
 *           default: "black"
 */

/**
 * @swagger
 * /canvas/draw-canvas:
 *   post:
 *     summary: Initialize a new canvas with specified dimensions
 *     tags: [Canvas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DrawCanvas'
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
 *                 width:
 *                   type: number
 *                 height:
 *                   type: number
 *       400:
 *         description: Width and height are required
 */
router.post("/draw-canvas", canvasController.drawCanvas);

/**
 * @swagger
 * /canvas/draw-text:
 *   post:
 *     summary: Draw text on the canvas
 *     tags: [Canvas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DrawText'
 *     responses:
 *       200:
 *         description: Text added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Canvas not initialized or missing required parameters
 */
router.post("/draw-text", canvasController.drawText);

/**
 * @swagger
 * /canvas/draw-element:
 *   post:
 *     summary: Draw a shape on the canvas
 *     tags: [Canvas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DrawElement'
 *     responses:
 *       200:
 *         description: Element added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Canvas not initialized or invalid parameters
 */
router.post("/draw-element", canvasController.drawElement);

/**
 * @swagger
 * /canvas/export-html:
 *   get:
 *     summary: Export canvas as HTML file
 *     tags: [Canvas]
 *     responses:
 *       200:
 *         description: HTML file download
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Canvas not initialized
 *       500:
 *         description: Error during file generation or download
 */
router.get("/export-html", canvasController.exportCanvasHTML);

/**
 * @swagger
 * /canvas/export-svg:
 *   get:
 *     summary: Export canvas as SVG file
 *     tags: [Canvas]
 *     responses:
 *       200:
 *         description: SVG file download
 *         content:
 *           image/svg+xml:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Canvas not initialized
 *       500:
 *         description: Error during file generation or download
 */
router.get("/export-svg", canvasController.exportCanvasSVG);

/**
 * @swagger
 * /canvas/download:
 *   get:
 *     summary: Download canvas as PNG file
 *     tags: [Canvas]
 *     responses:
 *       200:
 *         description: PNG file download
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Canvas not initialized
 *       500:
 *         description: Error during file generation or download
 */
router.get("/download", canvasController.canvasDownload);

module.exports = router;

/**
 * @swagger
 * /hello:
 *   get:
 *     summary: Say Hello
 *     description: Returns a simple hello message.
 *     tags:
 *       - Hello
 *     responses:
 *       200:
 *         description: A hello message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello World
 */
const express = require("express");
const router = express.Router();
const { sayHello } = require("../controllers/helloController");

router.get("/", sayHello);

module.exports = router;

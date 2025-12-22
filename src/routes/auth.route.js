const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

/**
 * @swagger
 * /auth/new-cookie:
 *   post:
 *     summary: Lấy session cookie ASP.NET
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Lấy cookie thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 cookie:
 *                   type: string
 *                   example: ASP.NET_SessionId=leu5jgswdrdcrdq5sagaq2qg
 */
router.post("/new-cookie", authController.newCookie);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập hệ thống tín chỉ
 *     tags: [Auth]
 *     security:
 *       - SessionCookie: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: 20123456
 *               password:
 *                 type: string
 *                 example: 123456
 *               role:
 *                 type: integer
 *                 default: 0
 *                 description: 0 = Sinh viên, 1 = Giảng viên
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Sai thông tin đăng nhập
 */
router.post("/login", authController.login);

module.exports = router;

const express = require("express");
const router = express.Router();
const axios = require("axios");

const TARGET_URL = "https://tinchi.hau.edu.vn/default.aspx";

/**
 * @swagger
 * /session/get-session:
 *   get:
 *     summary: Lấy ASP.NET_SessionId từ hệ thống tín chỉ HAU
 *     description: |
 *       Gửi request đến trang tín chỉ HAU và trích xuất cookie `ASP.NET_SessionId`
 *       từ header `set-cookie`. Session này dùng cho các bước tiếp theo như login,
 *       lấy thông tin sinh viên, đăng ký tín chỉ,...
 *     tags: [Session]
 *     responses:
 *       200:
 *         description: Lấy session thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 aspsessionid:
 *                   type: string
 *                   description: Giá trị của cookie ASP.NET_SessionId
 *                   example: "abc123xyz456"
 *                 full_cookie:
 *                   type: string
 *                   description: Cookie gốc từ server (debug)
 *                   example: "ASP.NET_SessionId=abc123xyz456; path=/; HttpOnly"
 *       404:
 *         description: Không tìm thấy cookie hoặc không có ASP.NET_SessionId
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Không tìm thấy ASP.NET_SessionId"
 *       500:
 *         description: Lỗi khi kết nối tới hệ thống tín chỉ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Lỗi khi kết nối tới server tinchi"
 *                 details:
 *                   type: string
 *                   example: "timeout of 10000ms exceeded"
 */
router.get("/get-session", async (req, res) => {
  try {
    const response = await axios.get(TARGET_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      timeout: 10000,
    });

    const cookies = response.headers["set-cookie"];

    if (!cookies) {
      return res.status(404).json({ error: "Không tìm thấy cookie từ server" });
    }

    let sessionId = null;
    cookies.forEach((cookie) => {
      if (cookie.includes("ASP.NET_SessionId")) {
        sessionId = cookie.split(";")[0].split("=")[1];
      }
    });

    if (sessionId) {
      res.json({
        success: true,
        aspsessionid: sessionId,
        full_cookie: cookies[0],
      });
    } else {
      res.status(404).json({ error: "Không tìm thấy ASP.NET_SessionId" });
    }
  } catch (error) {
    console.error("Lỗi khi lấy cookie:", error.message);
    res.status(500).json({
      error: "Lỗi khi kết nối tới server tinchi",
      details: error.message,
    });
  }
});

module.exports = router;

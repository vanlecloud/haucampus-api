const express = require("express");
const router = express.Router();
const axios = require("axios");

const TARGET_URL = "https://tinchi.hau.edu.vn/";

/**
 * @swagger
 * /new-cookie:
 *   get:
 *     summary: Lấy ASP.NET_SessionId từ hệ thống tín chỉ HAU
 *     description: |
 *       Gửi request đến https://tinchi.hau.edu.vn và trích xuất cookie
 *       `ASP.NET_SessionId` từ header `set-cookie`. Cookie này dùng để
 *       duy trì session cho các bước như login, xem thông tin sinh viên,
 *       đăng ký tín chỉ,...
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
 *                   example: "xgjta20bawwtemcyvaczy0"
 *                 rawCookies:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example:
 *                     - "ASP.NET_SessionId=xgjta20bawwtemcyvaczy0; path=/; HttpOnly"
 *       404:
 *         description: Không tìm thấy ASP.NET_SessionId
 *       500:
 *         description: Lỗi kết nối tới hệ thống tín chỉ
 */
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(TARGET_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      timeout: 10000,

      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
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

    if (!sessionId) {
      return res.status(404).json({ error: "Không tìm thấy ASP.NET_SessionId" });
    }

    res.json({
      success: true,
      aspsessionid: sessionId,
      rawCookies: cookies,
    });

  } catch (error) {
    console.error("Session Error:", error.message);
    res.status(500).json({
      error: "Lỗi khi kết nối tới hệ thống tín chỉ",
      details: error.message,
    });
  }
});

module.exports = router;

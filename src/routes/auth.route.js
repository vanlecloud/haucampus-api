const express = require("express");
const router = express.Router();
const authService = require("../services/auth.service");

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
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
 *               role:
 *                 type: integer
 *                 default: 0
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 */
router.post("/login", async (req, res) => {
  try {
    let { username, password, role = 0 } = req.body;
    role = Number(role) || 0;

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Thiếu ASP.NET_SessionId (Bearer token)",
      });
    }

    const sessionId = authHeader.split(" ")[1];
    const cookie = `ASP.NET_SessionId=${sessionId}`;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Thiếu username hoặc password",
      });
    }

    const loginOk = await authService.login({
      username,
      password,
      role,
      cookie,
    });

    if (!loginOk) {
      return res.status(401).json({
        success: false,
        message: "Sai tài khoản hoặc mật khẩu",
      });
    }

    let userData = null;

    if (role === 0) {
      userData = await authService.getStudentInfo(cookie);
    } else {
      const teacherInfo = await authService.getTeacherInfo(cookie);
      userData = teacherInfo ? { ...teacherInfo, userRole: "teacher" } : null;
    }

    if (!userData) {
      return res.status(401).json({
        success: false,
        message: "Session hết hạn hoặc không lấy được dữ liệu",
      });
    }

    return res.json({ success: true, data: userData });

  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
    });
  }
});

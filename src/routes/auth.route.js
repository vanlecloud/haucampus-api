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
  const auth = req.headers.authorization;
  if (!auth) {
    return res.status(400).json({
      success: false,
      message: "Thiếu Authorization header",
    });
  }

  try {
    // 1. Lấy cookie mới từ TinChi
    const cookie = await authService.getNewCookie();

    // 2. Login với cookie đó
    const loginOk = await authService.login({ username, password, role, cookie });
    if (!loginOk) {
      return res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
    }

    // 3. Lấy thông tin user
    let userData;
    if (role === 0) {
      userData = await authService.getStudentInfo(cookie);
      if (!userData) {
        return res.status(401).json({ success: false, message: "Thông tin sinh viên không hợp lệ" });
      }
    } else {
      const teacherInfo = await authService.getTeacherInfo(cookie);
      if (!teacherInfo) {
        return res.status(401).json({ success: false, message: "Thông tin giảng viên không hợp lệ" });
      }
      userData = { ...teacherInfo, userRole: "teacher" };
    }

    // 4. Trả cookie để client lưu lại
    res.json({ success: true, data: userData, sessionCookie: cookie });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ success: false, message: "Lỗi hệ thống" });
  }
});

module.exports = router;

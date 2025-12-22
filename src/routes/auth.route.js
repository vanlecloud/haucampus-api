const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authService = require("../services/auth.service");

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
router.post("/new-cookie", async (req, res) => {
  try {
    const cookie = await authService.getNewCookie();
    if (!cookie) return res.status(500).json({ success: false, message: "Không lấy được session cookie" });
    res.json({ success: true, cookie });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi tạo session" });
  }
});


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập hệ thống tín chỉ
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
 *               - cookie
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
 *               cookie:
 *                 type: string
 *                 description: Cookie ASP.NET_SessionId từ /auth/new-cookie
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Sai thông tin đăng nhập
 */
router.post("/login", async (req, res) => {
  const { username, password, role = 0 } = req.body;

  if (!username || !password || (role !== 0 && role !== 1)) {
    return res.status(400).json({
      success: false,
      message: "Thông tin đăng nhập không hợp lệ",
    });
  }

  try {
    const loginOk = await authService.login({ username, password, role, cookie });

    if (!loginOk)
      return res.status(401).json({
        success: false,
        message: "Sai tài khoản hoặc mật khẩu",
      });

    let userData;
    if (role === 0) {
      const studentInfo = await authService.getStudentInfo(cookie);
      if (!studentInfo)
        return res.status(401).json({
          success: false,
          message: "Thông tin sinh viên không hợp lệ",
        });
      userData = studentInfo;
    } else {
      const teacherInfo = await authService.getTeacherInfo(cookie, username);
      if (!teacherInfo)
        return res.status(401).json({
          success: false,
          message: "Thông tin giảng viên không hợp lệ",
        });
      userData = { ...teacherInfo, userRole: "teacher" };
    }

    res.json({
      success: true,
      data: userData,
      sessionCookie: cookie, 
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ success: false, message: "Lỗi hệ thống" });
  }
});

module.exports = router;

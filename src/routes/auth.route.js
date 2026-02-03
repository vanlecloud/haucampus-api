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

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Thiếu username hoặc password",
      });
    }

    const loginOk = await authService.login({ username, password, role });

    if (!loginOk) {
      return res.status(401).json({
        success: false,
        message: "Sai tài khoản hoặc mật khẩu",
      });
    }

    let userData = null;

    if (role === 0) {
      userData = await authService.getStudentInfo();
      if (!userData) {
        return res.status(401).json({
          success: false,
          message: "Không lấy được thông tin",
        });
      }
    } else {
      const teacherInfo = await authService.getTeacherInfo();
      if (!teacherInfo) {
        return res.status(401).json({
          success: false,
          message: "Không lấy được thông tin",
        });
      }
      userData = { ...teacherInfo, userRole: "teacher" };
    }

    return res.json({
      success: true,
      data: userData,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err.message);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
    });
  }
});

module.exports = router;

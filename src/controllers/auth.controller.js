const authService = require("../services/auth.service");

exports.newCookie = async (req, res) => {
  try {
    const cookie = await authService.getNewCookie();

    if (!cookie) {
      return res.status(500).json({
        success: false,
        message: "Không lấy được session cookie",
      });
    }

    res.json({
      success: true,
      cookie,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Lỗi tạo session",
    });
  }
};

exports.login = async (req, res) => {
  const { username, password, role = 0 } = req.body;

  try {
    const cookie = await authService.getNewCookie();

    const ok = await authService.login({
      username,
      password,
      role,
      cookie,
    });

    if (!ok) {
      return res.status(401).json({
        success: false,
        message: "Sai tài khoản hoặc mật khẩu",
      });
    }

        let userData;
    if (role === 0) {
      const studentInfo = await authService.getStudentInfo(cookie);
      userData = {
        ...studentInfo,
        userRole: "student",
      };
    } else if (role === 1) {

      userData = {
        username,
        userRole: "teacher",
      };
    }

    res.status(201).json(userData);
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
    });
  }
};

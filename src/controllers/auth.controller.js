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

    res.json({
      username: "Lê Hồng Vân",
      classStudy: "2021CDP1",
      studentId: "2155020107",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
    });
  }
};

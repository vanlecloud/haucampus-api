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
  try {
    const { username, password, role = 0 } = req.body;
    const cookie = req.headers.cookie;

    if (!cookie) {
      return res.status(400).json({
        success: false,
        message: "Thiếu session cookie",
      });
    }

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
      success: true,
      message: "Đăng nhập thành công",
      user: {
        username,
        role,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Lỗi đăng nhập",
    });
  }
};

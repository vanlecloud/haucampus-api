const authService = require("../services/auth.service");

exports.newCookie = async (req, res) => {
  try {
    const cookie = await authService.getNewCookie();
    if (!cookie) {
      return res.status(500).json({ success: false, message: "Không lấy được session cookie" });
    }
    res.json({ success: true, cookie });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi tạo session" });
  }
};

exports.login = async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || (role !== 0 && role !== 1)) {
    return res.status(400).json({
      success: false,
      message: "Thông tin đăng nhập không hợp lệ hoặc role không đúng",
    });
  }

  try {
    const cookie = await authService.getNewCookie();

    const loginOk = await authService.login({ username, password, role, cookie });

    if (!loginOk) {
      return res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
    }

    let userData;

    if (role === 0) {
      const studentInfo = await authService.getStudentInfo(cookie);
      if (!studentInfo) {
        return res.status(401).json({ success: false, message: "Thông tin sinh viên không hợp lệ" });
      }
      userData = studentInfo;
    } else if (role === 1) {
      const teacherInfo = await authService.getTeacherInfo(cookie, username);
      if (!teacherInfo) {
        return res.status(401).json({ success: false, message: "Thông tin giảng viên không hợp lệ" });
      }
      userData = teacherInfo;
    }

    return res.status(200).json({ success: true, data: userData, sessionCookie: cookie });

  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
  }
};

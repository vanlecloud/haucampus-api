const authService = require("../services/auth.service");

exports.newCookie = async (req, res) => {
  try {
    const cookie = await authService.getNewCookie();
    if (!cookie) return res.status(500).json({ success: false, message: "Không lấy được session cookie" });

    res.json({ success: true, cookie });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi tạo session" });
  }
};

exports.login = async (req, res) => {
  let { username, password, role } = req.body;
  role = Number(role);

  if (!username || !password || ![0, 1].includes(role)) {
    return res.status(400).json({ success: false, message: "Thông tin đăng nhập không hợp lệ hoặc role không đúng" });
  }

  try {
    const cookie = await authService.getNewCookie();
    const loginOk = await authService.login({ username, password, role, cookie });

    if (!loginOk) return res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });

    let userData;
    if (role === 0) {
      const studentInfo = await authService.getStudentInfo(cookie);
      if (!studentInfo) return res.status(401).json({ success: false, message: "Thông tin sinh viên không hợp lệ" });
      userData = { ...studentInfo, userRole: "student" };
    } else {
      userData = { username, userRole: "teacher" };
    }

    return res.status(200).json(userData);
  } catch (err) {
    console.log("Login error:", err);
    return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
  }
};

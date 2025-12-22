const authService = require("../services/auth.service");

exports.login = async (req, res) => {
  let { username, password, role } = req.body;
  role = Number(role);

  if (!username || !password || ![0, 1].includes(role)) {
    return res.status(400).json({ success: false, message: "Thông tin không hợp lệ" });
  }

  try {
    const cookie = await authService.getNewCookie();
    
    const loginOk = await authService.login({ username, password, role, cookie });

    if (!loginOk) {
      return res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
    }

    let userData = {};
    if (role === 0) {
      const studentInfo = await authService.getStudentInfo(cookie);
      if (!studentInfo) {
        return res.status(401).json({ success: false, message: "Không thể lấy thông tin sinh viên" });
      }
      userData = studentInfo; 
    } else {
      userData = { username, fullName: "Giảng viên", userRole: "teacher" };
    }

    return res.status(200).json({
      success: true,
      data: userData,
      sessionCookie: cookie 
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Lỗi kết nối máy chủ trường" });
  }
};
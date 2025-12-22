const authService = require("../services/auth.service");

exports.newCookie = async (req, res) => {
  try {
    const cookie = await authService.getNewCookie();
    if (!cookie) {
      return res.status(500).json({ success: false, message: "Không lấy được session cookie" });
    }
    res.json({ success: true, cookie });
  } catch (err) {
    console.error("NEW COOKIE ERROR:", err);
    res.status(500).json({ success: false, message: "Lỗi tạo session" });
  }
};

exports.login = async (req, res) => {
  const { username, password, role } = req.body;
  const cookie = req.headers.cookie; 

  if (!username || !password || (role !== 0 && role !== 1)) {
    return res.status(400).json({ success: false, message: "Thông tin đăng nhập không hợp lệ" });
  }

  if (!cookie) {
    return res.status(400).json({ success: false, message: "Thiếu session cookie trong header" });
  }

  try {
    const loginOk = await authService.login({ username, password, role });

    if (!loginOk) return res.status(401).json({ success: false, message: "Sai thông tin đăng nhập" });

    let userData = role === 0
      ? await authService.getStudentInfo(cookie)
      : await authService.getTeacherInfo(cookie);

    if (!userData) return res.status(401).json({ success: false, message: "Không lấy được thông tin người dùng" });

    res.status(200).json({ success: true, data: userData });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Lỗi hệ thống" });
  }
};


const axios = require("axios");
const qs = require("qs");
const cheerio = require("cheerio");

const BASE_URL = "https://tinchi.hau.edu.vn";

/**
 * Lấy cookie ASP.NET_SessionId
 */
exports.getNewCookie = async () => {
  const res = await axios.get(`${BASE_URL}/`, { withCredentials: true });
  const cookie = res.headers["set-cookie"]
    .find(c => c.startsWith("ASP.NET_SessionId"))
    .split(";")[0];
  return cookie;
};

/**
 * Login vào TinChi
 */
exports.login = async ({ username, password, role = 0, cookie }) => {
  const payload = qs.stringify({
    Role: role,
    UserName: username,
    Password: password,
  });

  const res = await axios.post(`${BASE_URL}/DangNhap/CheckLogin`, payload, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookie,
      Referer: BASE_URL + "/",
    },
    maxRedirects: 0,
    validateStatus: s => s < 500,
  });

  return res.status === 302;
};

/**
 * Lấy thông tin sinh viên
 */
exports.getStudentInfo = async (cookie) => {
  try {
    const res = await axios.get(`${BASE_URL}/SinhVien/ThongTinSinhVien`, {
      headers: { Cookie: cookie },
    });

    const $ = cheerio.load(res.data);

    const studentId = $("#lblMaSinhVien").text().trim();

    const infoBlock = $(".navbar-right .styMenu").first();
    const rawHtml = infoBlock.html() || "";
    const parts = rawHtml.split(/<br\s*\/?>/i);

    const fullName = parts[0] ? parts[0].trim() : "";
    const classStudy = parts[1] ? parts[1].trim() : "";

    if (!studentId || !fullName) return null;

    return {
      studentId,
      username: fullName,  // dùng username = fullName
      classStudy,
      userRole: "student"
    };
  } catch (error) {
    console.error("Lỗi lấy thông tin sinh viên:", error);
    return null;
  }
};

/**
 * Lấy thông tin giảng viên
 */
exports.getTeacherInfo = async (cookie, username) => {
  try {
    const res = await axios.get(`${BASE_URL}/GiangVien/ThongTin/${username}`, {
      headers: { Cookie: cookie },
    });

    const $ = cheerio.load(res.data);

    const fullName = $("#lblHoTen").text().trim();
    const faculty = $("#lblKhoa").text().trim();

    if (!fullName) return null;

    return {
      username: fullName,   
      faculty,
      userRole: "teacher"
    };
  } catch (error) {
    console.error("Lỗi lấy thông tin giảng viên:", error);
    return null;
  }
};

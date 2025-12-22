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
  const res = await axios.get(`${BASE_URL}/SinhVien/ThongTinSinhVien`, {
    headers: { Cookie: cookie },
  });

  const $ = cheerio.load(res.data);

  const studentId = $("#lblMaSinhVien").text().trim();
  const fullName = $("#lblHoTen").text().trim();
  const classStudy = $("#lblLop").text().trim();

  if (!studentId || !fullName || !classStudy) return null;

  return {
    studentId,
    username: fullName,
    classStudy,
    userRole: "student",
  };
};

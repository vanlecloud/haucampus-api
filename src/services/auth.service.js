const axios = require("axios");
const qs = require("qs");
const cheerio = require("cheerio");

const BASE_URL = "https://tinchi.hau.edu.vn";

exports.login = async ({ username, password, role = 0, cookie }) => {
  if (!cookie) throw new Error("Missing ASP.NET session");

  const payload = qs.stringify({
    Role: role,
    UserName: username,
    Password: password,
  });

  const res = await axios.post(`${BASE_URL}/DangNhap/CheckLogin`, payload, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookie, 
      Referer: `${BASE_URL}/`,
      "User-Agent": "Mozilla/5.0",
    },
    maxRedirects: 0,
    validateStatus: (s) => s < 500,
  });

  return res.status === 302;
};

exports.getStudentInfo = async (cookie) => {
  if (!cookie) throw new Error("Missing ASP.NET session");

  try {
    const res = await axios.get(`${BASE_URL}/SinhVien/ThongTinSinhVien`, {
      headers: {
        Cookie: cookie,
        "User-Agent": "Mozilla/5.0",
      },
    });

    const $ = cheerio.load(res.data);

    const studentId = $("#lblMaSinhVien").text().trim();
    const infoBlock = $(".navbar-right .styMenu").first();
    const rawHtml = infoBlock.html() || "";
    const parts = rawHtml.split(/<br\s*\/?>/i);

    const fullName = parts[0]?.trim() || "";
    const classStudy = parts[1]?.trim() || "";

    if (!studentId || !fullName) return null;

    return {
      studentId,
      username: fullName,
      classStudy,
      userRole: "student",
    };
  } catch (err) {
    console.error("Student info error:", err.message);
    return null;
  }
};

exports.getTeacherInfo = async (cookie) => {
  if (!cookie) throw new Error("Missing ASP.NET session");

  try {
    const res = await axios.get(`${BASE_URL}/GiangVien/ThongTinCaNhan`, {
      headers: {
        Cookie: cookie,
        "User-Agent": "Mozilla/5.0",
      },
    });

    const $ = cheerio.load(res.data);
    const infoBlock = $(".navbar-right .styMenu").first();
    const rawHtml = infoBlock.html() || "";
    const parts = rawHtml.split(/<br\s*\/?>/i);

    const fullName = parts[0]?.trim() || "";
    if (!fullName) return null;

    return { username: fullName, userRole: "teacher" };
  } catch (err) {
    console.error("Teacher info error:", err.message);
    return null;
  }
};

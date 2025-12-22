const axios = require("axios");
const qs = require("qs");

const BASE_URL = "https://tinchi.hau.edu.vn";

/**
 * Lấy cookie ASP.NET_SessionId
 */
exports.getNewCookie = async () => {
  const res = await axios.get("https://tinchi.hau.edu.vn/", {
    withCredentials: true,
  });

  const cookie = res.headers["set-cookie"]
    .find(c => c.startsWith("ASP.NET_SessionId"))
    .split(";")[0];

  return cookie;
};

/**
 * Login
 */
exports.login = async ({ username, password, role = 0, cookie }) => {
  const payload = qs.stringify({
    Role: role,
    UserName: username,
    Password: password,
  });

  const res = await axios.post(
    "https://tinchi.hau.edu.vn/DangNhap/CheckLogin",
    payload,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookie,
        Referer: "https://tinchi.hau.edu.vn/",
      },
      maxRedirects: 0,
      validateStatus: s => s < 500,
    }
  );

  return res.status === 302;
};

exports.getStudentInfo = async (cookie)=>{
    const res = await axios.get(
        "https://tinchi.hau.edu.vn/SinhVien/ThongTinSinhVien",{
            headers: {
                Cookie: cookie,
            },
        }
    );
    const $ = cheerio.load(res.data);
    const studentId = $("#lblMaSV").text().trim();
    const fullName = $("#lblHoTen").text().trim();
    const classStudy = $("#lblLop").text().trim();
     return {
    studentId,
    username: fullName,
    classStudy,
  };
};

const axios = require("axios");
const qs = require("qs");

const BASE_URL = "https://tinchi.hau.edu.vn";

/**
 * Lấy cookie ASP.NET_SessionId
 */
exports.getNewCookie = async () => {
  const res = await axios.get(BASE_URL, {
    withCredentials: true,
  });

  const setCookie = res.headers["set-cookie"];
  if (!setCookie) return null;

  const sessionCookie = setCookie.find(c =>
    c.startsWith("ASP.NET_SessionId")
  );

  return sessionCookie.split(";")[0];
};

/**
 * Login
 */
exports.login = async ({ username, password, role, cookie }) => {
  const loginUrl =
    role === 1
      ? `${BASE_URL}/Account/LoginGV`
      : `${BASE_URL}/Account/LoginSV`;

  const payload = qs.stringify({
    UserName: username,
    Password: password,
  });

  const res = await axios.post(loginUrl, payload, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookie,
      Referer: BASE_URL,
    },
    withCredentials: true,
    maxRedirects: 0,
    validateStatus: status => status < 500,
  });

  if (res.status === 302) {
    return true;
  }

  return false;
};

exports.getStudentInfo = async (cookie)=>{
    const res = await axios.get(
        "https://tinchi.hau.edu.vn/SinhVien/ThongTinSinhVien",{
            header: {
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

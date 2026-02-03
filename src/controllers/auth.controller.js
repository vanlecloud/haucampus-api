const axios = require("axios");
const qs = require("qs");

exports.login = async ({ username, password, role, cookie }) => {
  try {
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
          "User-Agent": "Mozilla/5.0",
        },
        maxRedirects: 0,
        validateStatus: (s) => s < 400,
      }
    );

    if (res.headers.location || res.status === 302) {
      return true;
    }

    return false;
  } catch (err) {
    console.log("LOGIN FAIL:", err.message);
    return false;
  }
};

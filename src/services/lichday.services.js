const axios = require("axios");

async function getlichDay({ namHoc, hocKy, cookie }) {
  try {
    const res = await axios.post(
      "https://tinchi.hau.edu.vn/GiangVien/LichGiangDay/LoadThoiKhoaBieu",
      new URLSearchParams({
        namHoc,
        hocKy,
        dotHoc: 0
      }).toString(),
      {
        headers: {
          Cookie: cookie,
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
          "User-Agent": "Mozilla/5.0"
        },
        timeout: 10000
      }
    );

    if (!Array.isArray(res.data)) {
      throw new Error("Cookie hết hạn hoặc chưa đăng nhập");
    }

    return res.data.map(item => ({
      maHocPhan: item.MaHocPhan,
      tenHocPhan: item.TenHocPhan,
      soTinChi: item.SoTinChi,
      tenLopTinChi: item.TenLop,
      phong: item.TenPhong,
      tiet: item.TietHoc,
      thu: `Thứ ${item.Thu}`,
      ngayHoc: `${item.NgayBatDau} - ${item.NgayKetThuc}`
    }));

  } catch (err) {
    console.error("❌ getlichDay error:", err.message);
    throw err;
  }
}

module.exports = { getlichDay };

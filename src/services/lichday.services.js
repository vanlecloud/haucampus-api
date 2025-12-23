const axios = require("axios");
const qs = require("qs");

async function getlichDay({ namHoc, hocKy, cookie }) {
  const url = "https://tinchi.hau.edu.vn/GiangVien/LichGiangDay/LoadThoiKhoaBieu";

  const res = await axios.post(
    url,
    qs.stringify({
      namHoc,
      hocKy,
      dotHoc: 0,
    }),
    {
      headers: {
        Cookie: cookie,
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
        "User-Agent": "Mozilla/5.0",
      },
    }
  );

  return res.data.map(item => ({
    maHocPhan: item.MaHocPhan,
    tenHocPhan: item.TenHocPhan,
    soTinChi: item.SoTinChi,
    tenLopTinChi: item.TenLopTinChi,
    phong: item.TenPhong,
    tiet: item.Tiet,
    thu: item.Thu,
    ngayHoc: item.NgayHoc,
  }));
}

module.exports = { getlichDay };

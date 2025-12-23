const axios = require("axios");

async function getlichDay({ namHoc, hocKy, cookie }) {
  const url = "https://tinchi.hau.edu.vn/GiangVien/LichGiangDay/LoadThoiKhoaBieu";

  const res = await axios.post(
    url,
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
      }
    }
  );

  const rawData = res.data;

  return rawData.map(item => ({
    maHocPhan: item.MaHocPhan,
    tenHocPhan: item.TenHocPhan,
    soTinChi: item.SoTinChi,
    tenLopTinChi: item.TenLop,
    phong: item.TenPhong,
    tiet: item.TietHoc,
    thu: `Thứ ${item.Thu}`,
    ngayHoc: `${item.NgayBatDau} - ${item.NgayKetThuc}`
  }));
}

module.exports = { getlichDay };

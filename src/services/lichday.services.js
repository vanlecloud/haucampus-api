const axios = require("axios");
const cheerio = require("cheerio");

async function getlichDay({ namHoc, hocKy, cookie }) {
  const url = `https://tinchi.hau.edu.vn/GiangVien/LichGiangDay/LoadThoiKhoaBieu?hocKy=${hocKy}&namHoc=${namHoc}&dotHoc=0`;

  const res = await axios.get(url, {
    headers: {
      Cookie: cookie,
      "User-Agent": "Mozilla/5.0",
      Accept: "text/html,application/json",
    },
  });

  const $ = cheerio.load(res.data);
  const rows = $("table tr"); 

  const schedule = [];
  let currentClass = {};

  rows.each((i, el) => {
    const tds = $(el).find("td");
    if (tds.length < 8) return;

    const maHocPhan = $(tds[0]).text().trim() || currentClass.maHocPhan;
    const tenHocPhan = $(tds[1]).text().trim() || currentClass.tenHocPhan;
    const soTinChi = $(tds[2]).text().trim() || currentClass.soTinChi;
    const tenLopTinChi = $(tds[3]).text().trim() || currentClass.tenLopTinChi;
    const phong = $(tds[4]).text().trim();
    const tiet = $(tds[5]).text().trim();
    const thu = $(tds[6]).text().trim();
    const ngayHoc = $(tds[7]).text().trim();

    schedule.push({ maHocPhan, tenHocPhan, soTinChi, tenLopTinChi, phong, tiet, thu, ngayHoc });

    currentClass = { maHocPhan, tenHocPhan, soTinChi, tenLopTinChi };
  });

  return schedule;
}

module.exports = { getlichDay };

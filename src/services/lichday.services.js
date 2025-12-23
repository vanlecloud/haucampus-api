const axios = require("axios");
const cheerio = require("cheerio");

async function getlichDay({ namHoc, hocKy, cookie }) {
  const url = `https://tinchi.hau.edu.vn/GiangVien/LichGiangDay/LoadThoiKhoaBieu?hocKy=${hocKy}&namHoc=${namHoc}&dotHoc=0`;

  const res = await axios.get(url, {
    headers: {
      Cookie: cookie,
      "User-Agent": "Mozilla/5.0",
    },
  });

  const $ = cheerio.load(res.data);
  const rows = $("table tr");

  const schedule = [];
  let currentClass = null;

  rows.each((_, el) => {
    const tds = $(el).find("td");
    if (tds.length === 0) return;

    let maHocPhan, tenHocPhan, soTinChi, tenLopTinChi;
    let phong, tiet, thu, ngayHoc;

    // dòng 1
    if (tds.length >= 8) {
      maHocPhan = $(tds[0]).text().trim();
      tenHocPhan = $(tds[1]).text().trim();
      soTinChi = $(tds[2]).text().trim();
      tenLopTinChi = $(tds[3]).text().trim();

      phong = $(tds[4]).text().trim();
      tiet = $(tds[5]).text().trim();
      thu = $(tds[6]).text().trim();
      ngayHoc = $(tds[7]).text().trim();

      currentClass = { maHocPhan, tenHocPhan, soTinChi, tenLopTinChi };
    }
//dòng 2 của lịch học
    else if (tds.length === 4 && currentClass) {
      ({ maHocPhan, tenHocPhan, soTinChi, tenLopTinChi } = currentClass);

      phong = $(tds[0]).text().trim();
      tiet = $(tds[1]).text().trim();
      thu = $(tds[2]).text().trim();
      ngayHoc = $(tds[3]).text().trim();
    } else {
      return;
    }if (
      !maHocPhan &&
      !tenHocPhan &&
      !tenLopTinChi &&
      !phong &&
      !thu
    ) {
      return;
    }
    schedule.push({
      maHocPhan,
      tenHocPhan,
      soTinChi,
      tenLopTinChi,
      phong,
      tiet,
      thu,
      ngayHoc,
    });
  });

  return schedule;
}

module.exports = { getlichDay };

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
  let lastClassInfo = {
    maHocPhan: "",
    tenHocPhan: "",
    soTinChi: "",
    tenLopTinChi: ""
  };

  rows.each((i, el) => {
    const tds = $(el).find("td");
    if (tds.length === 0) return; 

    let maHocPhan, tenHocPhan, soTinChi, tenLopTinChi, phong, tiet, thu, ngayHoc;

    if (tds.length >= 8) {
      maHocPhan = $(tds[0]).text().trim();
      tenHocPhan = $(tds[1]).text().trim();
      soTinChi = $(tds[2]).text().trim();
      tenLopTinChi = $(tds[3]).text().trim();
      phong = $(tds[4]).text().trim();
      tiet = $(tds[5]).text().trim();
      thu = $(tds[6]).text().trim();
      ngayHoc = $(tds[7]).text().trim();


      lastClassInfo = { maHocPhan, tenHocPhan, soTinChi, tenLopTinChi };
    } else if (tds.length > 0) {
      maHocPhan = lastClassInfo.maHocPhan;
      tenHocPhan = lastClassInfo.tenHocPhan;
      soTinChi = lastClassInfo.soTinChi;
      tenLopTinChi = lastClassInfo.tenLopTinChi;
      
      phong = $(tds[0]).text().trim();
      tiet = $(tds[1]).text().trim();
      thu = $(tds[2]).text().trim();
      ngayHoc = $(tds[3]).text().trim();
    }

    if (ngayHoc) {
      schedule.push({ 
        maHocPhan, 
        tenHocPhan, 
        soTinChi, 
        tenLopTinChi, 
        phong, 
        tiet, 
        thu, 
        ngayHoc 
      });
    }
  });

  return schedule;
}
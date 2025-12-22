const axios = require("axios");
const cheerio = require("cheerio");


/**
 * @param {string} namHoc 
 * @param {string} hocKy 
 * @param {string} cookie 
 */

async function getlichDay({ namHoc, hocKy, cookie }) {
  const url = `https://tinchi.hau.edu.vn/GiangVien/LichGiangDay?namHoc=${namHoc}&hocKy=${hocKy}`;

  const res = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0", Cookie: cookie, Accept: "text/html" },
  });

  const $ = cheerio.load(res.data);
  const tableRows = $("#gvListContact tbody tr");
  const schedule = [];
  let currentClass = {};

  tableRows.each((i, el) => {
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

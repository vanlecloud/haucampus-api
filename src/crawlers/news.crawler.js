const axios = require("axios");
const cheerio = require("cheerio");

async function crawlNews({ page = 1, IDCat = 2, Nhom = 0 } = {}) {
  const url = `https://tinchi.hau.edu.vn/ThongTin/ThongBao?CatID=${IDCat}&page=${page}&Nhom=${Nhom}`;
  console.log("Crawl URL:", url);
  
  const res = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "text/html"
    },
    timeout: 10000
  });

  const $ = cheerio.load(res.data);
  const news = [];

  $("table tr").each((i, el) => {
    const tds = $(el).find("td");
    if (tds.length >= 2) {
      const title = $(tds[0]).text().trim();
      const date = $(tds[1]).text().trim();
      if (title && date) news.push({ 0: title, 1: date });
    }
  });

  return news;
}


module.exports = crawlNews;

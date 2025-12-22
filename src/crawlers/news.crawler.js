const axios = require("axios");
const cheerio = require("cheerio");

async function crawlNews({ page = 1, IDCat = 2 } = {}) {

  // ✅ URL THÔNG BÁO ĐÚNG
  const url = `https://tinchi.hau.edu.vn/ThongTin/ThongBao?CatID=${IDCat}&page=${page}`;
  console.log("Crawl URL:", url);

  const res = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "text/html"
    },
    timeout: 10000
  });

  const html = res.data;

  // 🔴 Nếu vẫn trả về login → bắt lỗi ngay
  if (html.includes("Đăng nhập")) {
    throw new Error("Website trả về trang đăng nhập – không thể crawl");
  }

  const $ = cheerio.load(html);
  const news = [];

  /**
   * ⚠️ SELECTOR THỰC TẾ (PHỔ BIẾN)
   * Danh sách thông báo thường nằm trong bảng hoặc list
   * Bạn có thể chỉnh lại nếu Inspect thấy khác
   */
  $("table tr").each((i, el) => {
    const tds = $(el).find("td");

    if (tds.length >= 2) {
      const title = $(tds[0]).text().trim();
      const date = $(tds[1]).text().trim();

      if (title && date) {
        news.push({
          0: title,
          1: date
        });
      }
    }
  });

  return news;
}

module.exports = crawlNews;

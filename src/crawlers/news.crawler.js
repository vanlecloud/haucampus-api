const axios = require("axios");
const cheerio = require("cheerio");

async function crawlNews({ page = 1, IDCat = 5, Nhom = 0 } = {}) {
  // Lưu ý: Trang của trường dùng tham số Page (chữ P viết hoa)
  const url = `https://tinchi.hau.edu.vn/ThongTin/ThongBao?CatID=${IDCat}&Page=${page}&Nhom=${Nhom}`;
  console.log("Crawl URL:", url);
  
  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html"
      },
      timeout: 10000
    });

    const $ = cheerio.load(res.data);
    const news = [];

    // Lọc theo div nằm trong #dvData dựa trên cấu trúc bạn gửi
    $("#dvData > div").each((i, el) => {
      // 1. Lấy tiêu đề và Link từ thẻ <a> bên trong <h4>
      const aTag = $(el).find("h4 a");
      const title = aTag.text().trim();
      const rawLink = aTag.attr("href");
      const link = rawLink ? "https://tinchi.hau.edu.vn" + rawLink : "";

      // 2. Lấy ngày đăng (nằm trong thẻ span có icon đồng hồ)
      // Thường là thẻ span cuối cùng trong khối div đó
      const date = $(el).find("span").last().text().trim();

      // 3. Lấy ảnh thumbnail (nếu có)
      const imgTag = $(el).find("img").first().attr("src");
      const thumbnail = imgTag ? "https://tinchi.hau.edu.vn" + imgTag : null;

      if (title) {
        news.push({
          title: title,
          date: date,
          link: link,
          thumbnail: thumbnail
        });
      }
    });

    return news;
  } catch (error) {
    console.error("Lỗi crawl:", error.message);
    return [];
  }
}

module.exports = crawlNews;

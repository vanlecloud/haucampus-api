const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

/**
 * @swagger
 * /news:
 * get:
 * summary: Lấy danh sách thông báo từ HAU
 * tags:
 * - News
 * parameters:
 * - in: query
 * name: page
 * schema:
 * type: integer
 * default: 1
 * - in: query
 * name: IDCat
 * schema:
 * type: integer
 * default: 5
 * - in: query
 * name: Nhom
 * schema:
 * type: integer
 * default: 0
 * responses:
 * 200:
 * description: Thành công trả về mảng tin tức
 */

// Hàm crawl tách riêng để dễ quản lý
async function crawlNews({ page = 1, IDCat = 5, Nhom = 0 } = {}) {
  const url = `https://tinchi.hau.edu.vn/ThongTin/ThongBao?CatID=${IDCat}&Page=${page}&Nhom=${Nhom}`;
  
  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)",
        "Accept": "text/html"
      },
      timeout: 10000
    });

    const $ = cheerio.load(res.data);
    const news = [];

    $("#dvData > div").each((i, el) => {
      const aTag = $(el).find("h4 a");
      const title = aTag.text().trim();
      const rawLink = aTag.attr("href");
      const link = rawLink ? "https://tinchi.hau.edu.vn" + rawLink : "";
      const date = $(el).find("span").last().text().trim();
      const imgTag = $(el).find("img").first().attr("src");
      const thumbnail = imgTag ? "https://tinchi.hau.edu.vn" + imgTag : null;

      if (title) {
        news.push({ title, date, link, thumbnail });
      }
    });
    return news;
  } catch (error) {
    throw error;
  }
}

// Route chính
router.get("/", async (req, res) => {
  try {
    // Ưu tiên lấy IDCat từ query, nếu không có mới lấy mặc định
    const page = req.query.page || 1;
    const IDCat = req.query.IDCat || 5; 
    const Nhom = req.query.Nhom || 0;

    const data = await crawlNews({ page, IDCat, Nhom });

    res.json({
      success: true,
      page: parseInt(page),
      IDCat: parseInt(IDCat),
      Nhom: parseInt(Nhom),
      data: data
    });
  } catch (error) {
    console.error("Scraping Error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: "Không thể kết nối tới máy chủ trường" 
    });
  }
});

module.exports = router;

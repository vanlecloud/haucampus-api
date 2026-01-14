const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

/**
 * @swagger
 * /news:
 *   get:
 *     summary: Lấy danh sách thông báo
 *     description: Thông báo/ tin tức
 *     tags:
 *       - News
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: IDCat
 *         schema:
 *           type: integer
 *           example: 2
 *       - in: query
 *         name: Nhom
 *         schema:
 *           type: integer
 *           example: 0
 *     responses:
 *       200:
 *         description: Succes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 page:
 *                   type: integer
 *                 IDCat:
 *                   type: integer
 *                 Nhom:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       0:
 *                         type: string
 *                       1:
 *                         type: string
 */

router.get("/", async (req, res) => {
  try {
    // Lấy các tham số từ query string (ví dụ: /news?page=1&CatID=5)
    // Nếu không có, mặc định lấy trang 1 và CatID = 5 (Tin tức - Xử lý học tập)
    const page = req.query.page || 1;
    const CatID = req.query.CatID || 5;

    // Link gốc của trường hỗ trợ phân trang: &Page=...
    const url = `https://tinchi.hau.edu.vn/ThongTin/ThongBao?CatID=${CatID}&Page=${page}`;

    const response = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const newsList = [];

    // Lọc các khối tin tức trong div #dvData
    $("#dvData > div").each((i, el) => {
      const anchor = $(el).find("h4 a");
      const title = anchor.text().trim();
      const link = "https://tinchi.hau.edu.vn" + anchor.attr("href");
      const date = $(el).find("span").last().text().trim();
      const imageUrl = $(el).find("img").attr("src");

      if (title) {
        newsList.push({
          title,
          date,
          link,
          thumbnail: imageUrl ? "https://tinchi.hau.edu.vn" + imageUrl : null
        });
      }
    });

    // Trả về kết quả
    res.json({
      success: true,
      page: parseInt(page),
      category: parseInt(CatID),
      data: newsList
    });

  } catch (error) {
    console.error("Scraping Error:", error.message);
    res.status(500).json({ success: false, message: "Lỗi khi lấy tin tức" });
  }
});

module.exports = router;

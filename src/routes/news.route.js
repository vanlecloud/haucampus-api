const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

/**
 * @swagger
 * /news:
 *   get:
 *     summary: Lấy danh sách tin tức / thông báo
 *     tags: [News]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Trang hiện tại
 *       - in: query
 *         name: CatID
 *         schema:
 *           type: integer
 *         description: 5 = Tin tức, 2 = Thông báo
 *     responses:
 *       200:
 *         description: Thành công
 *       500:
 *         description: Lỗi server
 */
router.get("/", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const CatID = req.query.CatID || 5;

    const url = `https://tinchi.hau.edu.vn/ThongTin/ThongBao?CatID=${CatID}&Page=${page}`;

    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);
    const newsList = [];

    $("#dvData > div").each((i, el) => {
      const aTag = $(el).find("h4 a");
      const title = aTag.text().trim();
      const link = aTag.attr("href")
        ? "https://tinchi.hau.edu.vn" + aTag.attr("href")
        : "";
      const date = $(el).find("span").last().text().trim();
      const img = $(el).find("img").attr("src");

      if (title) {
        newsList.push({
          title,
          date,
          link,
          thumbnail: img ? "https://tinchi.hau.edu.vn" + img : null,
        });
      }
    });

    res.json({
      success: true,
      page: Number(page),
      category: Number(CatID),
      data: newsList,
    });
  } catch (error) {
    console.error("Scraping Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy tin tức",
    });
  }
});

module.exports = router;

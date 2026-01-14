const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

/**
 * @swagger
 * /news:
 *   get:
 *     tags: [News]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *
 *       - in: query
 *         name: CatID
 *         schema:
 *           type: integer
 *           enum: [2, 5]
 *
 *       - in: query
 *         name: Nhom
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 *       500:
 *         description: ERROR
 */
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const CatID = Number(req.query.CatID) || 5;
    const Nhom = Number(req.query.Nhom) || 0;

    let url = `https://tinchi.hau.edu.vn/ThongTin/ThongBao?CatID=${CatID}&Page=${page}`;

    // 🔥 Chỉ Thông báo (CatID = 2) mới dùng Nhom
    if (CatID === 2) {
      url += `&Nhom=${Nhom}`;
    }

    const response = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
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
      page,
      CatID,
      ...(CatID === 2 ? { Nhom } : {}),
      data: newsList,
    });
  } catch (error) {
    console.error("Scraping Error:", error.message);
    res.status(500).json({ success: false });
  }
});

module.exports = router;

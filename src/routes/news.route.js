const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

/**
 * @swagger
 * /news:
 * get:
 * summary: Lấy danh sách thông báo/tin tức
 * tags: [News]
 * parameters:
 * - in: query
 * name: IDCat
 * schema:
 * type: integer
 * description: 5 là Tin tức, 2 là Thông báo
 * - in: query
 * name: page
 * schema:
 * type: integer
 * - in: query
 * name: Nhom
 * schema:
 * type: integer
 * responses:
 * 200:
 * description: Thành công
 */
router.get("/", async (req, res) => {
    try {
        const { page = 1, IDCat = 5, Nhom = 0 } = req.query;
        
        // Gán logic URL linh hoạt cho IDCat 2 và 5
        let url = `https://tinchi.hau.edu.vn/ThongTin/ThongBao?CatID=${IDCat}&Page=${page}`;
        if (parseInt(IDCat) === 2) {
            url += `&Nhom=${Nhom}`;
        }

        const response = await axios.get(url, {
            headers: { "User-Agent": "Mozilla/5.0" },
            timeout: 10000
        });

        const $ = cheerio.load(response.data);
        const news = [];

        $("#dvData > div").each((i, el) => {
            const aTag = $(el).find("h4 a");
            const title = aTag.text().trim();
            const link = aTag.attr("href") ? "https://tinchi.hau.edu.vn" + aTag.attr("href") : "";
            const date = $(el).find("span").last().text().trim();
            const imgTag = $(el).find("img").first().attr("src");
            const thumbnail = imgTag ? "https://tinchi.hau.edu.vn" + imgTag : null;

            if (title) {
                news.push({ title, date, link, thumbnail });
            }
        });

        res.json({ success: true, data: news });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;

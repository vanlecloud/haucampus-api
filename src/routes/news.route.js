const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

/**
 * @swagger
 * /news:
 * get:
 * summary: Lấy dữ liệu theo ID danh mục (IDCat)
 * tags: [News]
 * parameters:
 * - in: query
 * name: IDCat
 * description: ID danh mục (2: Thông báo, 5: Tin tức, 3: Học phí...)
 * schema:
 * type: integer
 * - in: query
 * name: page
 * schema:
 * type: integer
 * - in: query
 * name: Nhom
 * description: Chỉ áp dụng cho một số IDCat như 2
 * schema:
 * type: integer
 */

router.get("/", async (req, res) => {
  try {
    // 1. Lấy tham số từ người dùng gửi lên
    const IDCat = req.query.IDCat || 5; // Mặc định là 5 nếu không truyền
    const page = req.query.page || 1;
    const Nhom = req.query.Nhom || 0;

    // 2. Xây dựng URL linh hoạt
    // Hầu hết các danh mục của HAU dùng CatID và Page
    let url = `https://tinchi.hau.edu.vn/ThongTin/ThongBao?CatID=${IDCat}&Page=${page}`;
    
    // Nếu là IDCat 2 (Thông báo) thì mới nối thêm tham số Nhom vào URL
    if (parseInt(IDCat) === 2) {
      url += `&Nhom=${Nhom}`;
    }

    console.log("Đang lấy dữ liệu từ:", url);

    const response = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 10000
    });

    const $ = cheerio.load(response.data);
    const newsList = [];

    // 3. Bóc tách dữ liệu từ HTML
    $("#dvData > div").each((i, el) => {
      const aTag = $(el).find("h4 a");
      const title = aTag.text().trim();
      const link = aTag.attr("href") ? "https://tinchi.hau.edu.vn" + aTag.attr("href") : "";
      const date = $(el).find("span").last().text().trim();
      const img = $(el).find("img").attr("src");

      if (title) {
        newsList.push({
          title,
          date,
          link,
          thumbnail: img ? "https://tinchi.hau.edu.vn" + img : null
        });
      }
    });

    // 4. Trả kết quả về cho App (APK)
    res.json({
      success: true,
      query: {
        IDCat: parseInt(IDCat),
        page: parseInt(page),
        Nhom: parseInt(IDCat) === 2 ? parseInt(Nhom) : "None"
      },
      data: newsList
    });

  } catch (error) {
    console.error("Lỗi:", error.message);
    res.status(500).json({ success: false, message: "Lỗi kết nối server trường" });
  }
});

module.exports = router;

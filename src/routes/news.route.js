const express = require("express");
const router = express.Router();
const crawlNews = require("../crawlers/news.crawler");
/**
 * @swagger
 * /news:
 *   get:
 *     summary: Lấy danh sách thông báo
 *     description: Crawl danh sách thông báo từ website tinchi.hau.edu.vn
 *     tags:
 *       - News
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Số trang cần lấy
 *       - in: query
 *         name: IDCat
 *         schema:
 *           type: integer
 *           example: 2
 *         description: ID danh mục (mặc định 2 - Thông báo)
 *     responses:
 *       200:
 *         description: Lấy danh sách thông báo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 total:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       0:
 *                         type: string
 *                         example: "Thông báo đăng ký học phần học kỳ II"
 *                       1:
 *                         type: string
 *                         example: "15/12/2024"
 *       500:
 *         description: Không thể lấy tin tức
 */
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const IDCat = Number(req.query.IDCat) || 2;

    const data = await crawlNews({ page, IDCat });

    res.json({
      success: true,
      page,
      total: data.length,
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Không thể lấy tin tức"
    });
  }
});

module.exports = router;

router.get("/", async (req, res) => {
  try {
    let { page,IDCat, Nhom } = req.query;
    page = page || 1;
    IDCat = IDCat || 2; 
    Nhom = Nhom || 2;

    const data = await crawlNews({ IDCat });

    res.json({
      success: true,
      page,
      IDCat,
      Nhom,
      total: data.length,
      data
    });
  }catch (err) {
  console.error("NEWS ERROR:", err.message);

  res.status(500).json({
    success: false,
    message: err.message
  });
}

});

module.exports = router;

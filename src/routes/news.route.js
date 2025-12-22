const express = require("express");
const router = express.Router();
const crawlNews = require("../crawlers/news.crawler");

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
    let page = Number(req.query.page) || 1;
    let IDCat = Number(req.query.IDCat) || 2;
    let Nhom = Number(req.query.Nhom) || 0;

    const data = await crawlNews({ page, IDCat, Nhom });

    res.json({
      success: true,
      page,
      IDCat,
      Nhom,
      data
    });
  } catch (err) {
    console.error("NEWS ERROR:", err.message);
    res.status(500).json({
      success: false,
      message: "Không thể lấy tin tức"
    });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");

/**
 * @swagger
 * /daotao/danh-sach-nganh:
 *   get:
 *     tags:
 *       - daotao
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 total:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       he:
 *                         type: string
 *                       khoa:
 *                         type: string
 *                       nganh:
 *                         type: string
 *                       chuyenNganh:
 *                         type: string
 *                       ID_dt:
 *                         type: integer
 */
router.get("/danh-sach-nganh", async (req, res) => {
  try {
    const url = "https://tinchi.hau.edu.vn/ChuongTrinhDaoTao/ToanTruong";
    const response = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const $ = cheerio.load(response.data);
    const result = [];

    $("#myTree > li").each((_, heNode) => {
      const he = $(heNode).children("a").text().trim();

      $(heNode).find("> ul > li").each((_, khoaNode) => {
        const khoa = $(khoaNode).children("a").text().trim();

        $(khoaNode).find("> ul > li").each((_, nganhNode) => {
          const nganh = $(nganhNode).children("a").text().trim();

          $(nganhNode).find("ul li a.ChuyenNganh").each((_, cnNode) => {
            result.push({
              he,
              khoa,
              nganh,
              chuyenNganh: $(cnNode).text().trim(),
              ID_dt: Number($(cnNode).attr("id")) || null,
            });
          });
        });
      });
    });

    res.json({ success: true, total: result.length, data: result });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/**
 * @swagger
 * /daotao/hoc-phan:
 *   get:
 *     tags:
 *       - daotao
 *     parameters:
 *       - in: query
 *         name: ID_dt
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 */
router.get("/hoc-phan", async (req, res) => {
  try {
    const { ID_dt } = req.query;
    if (!ID_dt) return res.status(400).json({ success: false });

    const url = `https://tinchi.hau.edu.vn/ChuongTrinhDaoTao/DanhSachHocPhan?ID_dt=${ID_dt}`;
    const response = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const $ = cheerio.load(response.data);
    const subjects = [];

    $("table.table tbody tr").each((_, el) => {
      const td = $(el).find("td");
      subjects.push({
        khoiKienThuc: $(td[0]).text().trim(),
        kyThu: $(td[1]).text().trim(),
        maHocPhan: $(td[2]).text().trim(),
        tenHocPhan: $(td[3]).text().trim(),
        elearning: $(td[4]).text().trim(),
        monTuChon: $(td[5]).text().trim(),
        soTinChi: $(td[6]).text().trim(),
        tongSoTiet: $(td[7]).text().trim(),
        chiTiet: $(td[8]).find("a").attr("href") || null,
        taiLieu: $(td[9]).find("a").attr("href") || null,
      });
    });

    res.json({ success: true, data: subjects });
  } catch {
    res.status(500).json({ success: false });
  }
});

module.exports = router;

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

    res.json(result);
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

    // Biến ghi nhớ để xử lý rowspan
    let currentKhoi = "";
    let currentKy = "";

    $("table.table tbody tr").each((_, el) => {
      const td = $(el).find("td");
      if (td.length === 10) {
        currentKhoi = $(td[0]).text().trim();
        currentKy = $(td[1]).text().trim();
        
        subjects.push({
          khoiKienThuc: currentKhoi,
          kyThu: currentKy,
          maHocPhan: $(td[2]).text().trim(),
          tenHocPhan: $(td[3]).text().trim(),
          elearning: $(td[4]).text().trim(),
          // Kiểm tra icon check cho môn tự chọn
          monTuChon: $(td[5]).find("i.fa-check-circle-o").length > 0 ? "1" : "0",
          soTinChi: $(td[6]).text().trim(),
          tongSoTiet: $(td[7]).text().trim(),
          chiTiet: $(td[8]).find("a").attr("id") || null, // Lấy ID chi tiết
          taiLieu: $(td[9]).find("a").attr("href") || null,
        });
      } 
      // Nếu dòng này bị thiếu cột do rowspan (dòng tiếp theo trong cùng kỳ)
      else if (td.length === 8) {
        subjects.push({
          khoiKienThuc: currentKhoi,
          kyThu: currentKy,
          maHocPhan: $(td[0]).text().trim(), // td[0] lúc này là Mã HP
          tenHocPhan: $(td[1]).text().trim(),
          elearning: $(td[2]).text().trim(),
          monTuChon: $(td[3]).find("i.fa-check-circle-o").length > 0 ? "1" : "0",
          soTinChi: $(td[4]).text().trim(),
          tongSoTiet: $(td[5]).text().trim(),
          chiTiet: $(td[6]).find("a").attr("id") || null,
          taiLieu: $(td[7]).find("a").attr("href") || null,
        });
      }
    });

    res.json(subjects);
  } catch (err) {
    res.status(500).json({ success: false });
  }
});
module.exports = router;

const express = require("express");
const router = express.Router();
const { getlichDay } = require("../services/lichday.service");

/**
 * @swagger
 * /teacher/lich-day:
 *   get:
 *     tags:
 *       - Teacher
 *     parameters:
 *       - in: query
 *         name: namHoc
 *         schema:
 *           type: string
 *           example: 2025-2026
 *         required: true
 *         description: Năm học
 *       - in: query
 *         name: hocKy
 *         schema:
 *           type: string
 *           example: 1
 *         required: true
 *         description: Học kỳ
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       maHocPhan:
 *                         type: string
 *                       tenHocPhan:
 *                         type: string
 *                       soTinChi:
 *                         type: string
 *                       tenLopTinChi:
 *                         type: string
 *                       tenPhong:
 *                         type: string
 *                       tiet:
 *                         type: string
 *                       thu:
 *                         type: string
 *                       ngayHoc:
 *                         type: string
 *       500:
 *         description: Lỗi hệ thống
 */

router.get("/lich-day", async (req, res) => {
  const { namHoc, hocKy } = req.query;
  const cookie = req.headers.cookie; 

  if (!namHoc || !hocKy || !cookie) {
    return res.status(400).json({ success: false, message: "Thiếu tham so" });
  }

  try {
    const schedule = await getlichDay({ namHoc, hocKy, cookie });
    res.json({ success: true, data: schedule });
  } catch (e) {
    console.error("Lỗi crawl lịch dạy:", e.message);
    res.status(500).json({ success: false, message: "Lỗi hệ thống" });
  }
});

module.exports = router;

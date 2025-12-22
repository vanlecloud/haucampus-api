const express = require("express");
const router = express.Router();
const lichDayController = require("../controllers/lichday.controller");

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
 *                       phong:
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

router.get("/lich-day", lichDayController.getSchedule);
module.exports = router;

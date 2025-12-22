const express = require("express");
const router = express.Router();
const { getLichGiangDay } = require("../services/lichGiangDay.service");

router.get("/", async (req, res) => {
  const { namHoc, hocKy } = req.query;
  const cookie = req.headers.cookie; 

  if (!namHoc || !hocKy || !cookie) {
    return res.status(400).json({ success: false, message: "Thiếu tham số" });
  }

  try {
    const schedule = await getLichGiangDay({ namHoc, hocKy, cookie });
    res.json({ success: true, data: schedule });
  } catch (e) {
    console.error("Lỗi crawl lịch dạy:", e.message);
    res.status(500).json({ success: false, message: "Lỗi hệ thống" });
  }
});

module.exports = router;

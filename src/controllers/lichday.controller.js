const { getlichDay } = require("../services/lichday.services");

exports.getSchedule = async (req, res) => {
  const cookie = req.headers.cookie;
  const { namHoc, hocKy } = req.query;

  if (!cookie) return res.status(400).json({ success: false, message: "Thiếu session cookie" });
  if (!namHoc || !hocKy) return res.status(400).json({ success: false, message: "Thiếu năm học hoặc học kỳ" });

  try {
    const schedule = await getlichDay({ namHoc, hocKy, cookie });
    res.json({ success: true, data: schedule });
  } catch (err) {
    console.error("Lỗi lấy lịch dạy:", err);
    res.status(500).json({ success: false, message: "Không thể lấy lịch dạy" });
  }
};

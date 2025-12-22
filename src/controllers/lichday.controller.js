const { getlichDay } = require("../services/lichday.services");

exports.getSchedule = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(400).json({ success: false, message: "Thiếu Authorization header" });

  const cookie = authHeader.split(" ")[1]; 
  const { namHoc, hocKy } = req.query;
  if (!namHoc || !hocKy) return res.status(400).json({ success: false, message: "Thiếu năm học hoặc học kỳ" });

  try {
    const schedule = await getlichDay({ namHoc, hocKy, cookie });
    res.json({ success: true, data: schedule });
  } catch (err) {
    console.error("Lỗi lấy lịch dạy:", err);
    res.status(500).json({ success: false, message: "Không thể lấy lịch dạy" });
  }
};

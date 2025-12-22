const express = require("express");
const router = express.Router();
const crawlNews = require("../crawlers/news.crawler");

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

const crawlNews = require("../crawlers/news.crawler");

(async () => {
  const data = await crawlNews();
  console.log(data);
})();

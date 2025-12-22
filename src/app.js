const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

app.use("/news", require("./routes/news.route"));

app.listen(PORT, () => {
  console.log("API running ON PORT", PORT);
});

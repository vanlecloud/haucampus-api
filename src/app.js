const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/daotao", require("./routes/daotao.route"));
app.use("/news", require("./routes/news.route"));
app.use("/cookie", require("./routes/cookie"));

try {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} catch (error) {
  console.error("Swagger setup error:", error);
}

app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

app.get("/", (req, res) => {
  res.send("HAUCampus API is running");
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`=================================`);
  console.log(`🚀 API đang chạy tại: http://0.0.0.0:${PORT}`);
  console.log(`📖 Tài liệu Swagger: http://0.0.0.0:${PORT}/docs`);
  console.log(`=================================`);
});

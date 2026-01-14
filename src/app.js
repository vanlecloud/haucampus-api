const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

const newsRoute = require("./routes/news.route");


app.use(cors());
app.use(express.json());

app.use("/daotao", require("./routes/daotao.route"));
app.use("/news", newsRoute);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("HAUCampus API is running");
});

app.listen(PORT, () => {
  console.log("API running ON PORT", PORT);
});

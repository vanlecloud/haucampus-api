const express = require("express");
const router = express.Router();
const axios = require("axios");

const TARGET_URL = "https://tinchi.hau.edu.vn/";

/**
 * @swagger
 * /auth/new-cookie:
 *   get:
 *     tags: [Session]
 *     responses:
 *       200:
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 */
router.get("/", async (req, res) => {
  try {
    const response = await axios.get(TARGET_URL, {
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 10000,
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400,
    });

    const cookies = response.headers["set-cookie"];
    if (!cookies) return res.sendStatus(404);

    const aspCookie = cookies.find(c => c.startsWith("ASP.NET_SessionId"));

    if (!aspCookie) return res.sendStatus(404);

    res.type("text/plain").send(aspCookie);

  } catch (err) {
    res.sendStatus(500);
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.get("/new-cookie", authController.newCookie);
router.post("/login", authController.login);

module.exports = router;

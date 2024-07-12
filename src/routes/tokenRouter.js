const express = require("express");
const router = express.Router();
const { refreshToken } = require("../services/refreshToken");

router.get("/token", refreshToken);

module.exports = router;

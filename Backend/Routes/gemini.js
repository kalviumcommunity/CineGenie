const express = require("express");
const { systemPrompt, zeroShot, oneShot } = require("../Controllers/geminiController");

const router = express.Router();

// POST /api/gemini/system-user
router.post("/system-user", systemPrompt);
router.post("/zero-shot", zeroShot);
router.post("/one-shot", oneShot);

module.exports = router;

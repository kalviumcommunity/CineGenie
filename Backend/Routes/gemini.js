const express = require("express");
const { systemPrompt, zeroShot } = require("../Controllers/geminiController");

const router = express.Router();

// POST /api/gemini/system-user
router.post("/system-user", systemPrompt);
router.post("/zero-shot", zeroShot);

module.exports = router;

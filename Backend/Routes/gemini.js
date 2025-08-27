const express = require("express");
const { systemPrompt, zeroShot, oneShot, multiShot, dynamicPrompt } = require("../Controllers/geminiController");

const router = express.Router();

router.post("/system-user", systemPrompt);

router.post("/zero-shot", zeroShot);

router.post("/one-shot", oneShot);

router.post("/multi-shot", multiShot);

router.post("/dynamic-prompt", dynamicPrompt);

module.exports = router;

const express = require("express");
const { getRecommendations } = require("../Controllers/geminiController");

const router = express.Router();

// POST /api/gemini/recommend
router.post("/recommend", getRecommendations);

module.exports = router;

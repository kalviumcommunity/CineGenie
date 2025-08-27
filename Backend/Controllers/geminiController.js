const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * 🎯 ZERO-SHOT PROMPT
 * - User just asks without examples.
 * - Model has to figure out how to recommend movies.
 */
exports.zeroShot = async (req, res) => {
  try {
    const { userQuery } = req.body;

    if (!userQuery) {
      return res.status(400).json({ message: "userQuery is required" });
    }

    const result = await model.generateContent(userQuery);

    res.json({
      success: true,
      query: userQuery,
      recommendations: result.response.text(),
    });
  } catch (error) {
    console.error("Zero-Shot Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 🎯 SYSTEM + USER PROMPT
 * - System sets the role (movie recommender AI).
 * - User gives input (mood/genre/actor).
 */
exports.systemPrompt = async (req, res) => {
  try {
    const { userQuery } = req.body;

    if (!userQuery) {
      return res.status(400).json({ message: "userQuery is required" });
    }

    // System instruction
    const systemPrompt = `
You are CineGenie 🎬, an AI movie recommendation assistant.
Your role:
- Suggest movies based on mood, genre, or actor.
- Provide 5 recommendations max.
- For each movie, include: Title, Year, Short 1-line description.
- Keep it fun, engaging, and easy to read.
    `;

    // Combine system + user
    const finalPrompt = `${systemPrompt}\n\nUser Request: ${userQuery}`;

    const result = await model.generateContent(finalPrompt);

    res.json({
      success: true,
      query: userQuery,
      recommendations: result.response.text(),
    });
  } catch (error) {
    console.error("System+User Prompt Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

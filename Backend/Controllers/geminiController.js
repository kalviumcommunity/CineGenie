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

/**
 * 🔹 ONE-SHOT PROMPT
 * Provide one example → then user’s question
 */
exports.oneShot = async (req, res) => {
  try {
    const { prompt } = req.body;
    const systemPrompt = `
You are CineGenie, an AI movie recommendation assistant.  

Example:
User: Suggest superhero comedy movies.
AI: [
  { "title": "Deadpool", "year": "2016", "description": "A funny, violent anti-hero film starring Ryan Reynolds." },
  { "title": "Thor: Ragnarok", "year": "2017", "description": "A Marvel film with humor, action, and vibrant visuals." }
]

Now, suggest 5 movies for: "${prompt}"
Format: JSON array only.
    `;

    const result = await model.generateContent(systemPrompt);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating one-shot response" });
  }
};

/**
 * 🔹 MULTI-SHOT PROMPT
 * Give multiple examples first → then user input
 */
exports.multiShot = async (req, res) => {
  try {
    const { prompt } = req.body;
    const systemPrompt = `
You are CineGenie, an AI movie recommender.

Example 1:
User: Romantic dramas
AI: [ { "title": "The Notebook", "year": "2004", "description": "A heartfelt romance about enduring love." } ]

Example 2:
User: Sci-fi space adventures
AI: [ { "title": "Interstellar", "year": "2014", "description": "A visually stunning story about space exploration and love." } ]

Now, recommend 5 movies for: "${prompt}".
Format strictly as JSON array.
    `;

    const result = await model.generateContent(systemPrompt);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating multi-shot response" });
  }
};

/**
 * 🔹 DYNAMIC PROMPT
 * Recommendations based on genre + mood
 */
exports.dynamicPrompt = async (req, res) => {
  try {
    const { genre, mood } = req.body;

    if (!genre || !mood) {
      return res.status(400).json({ message: "Genre and mood are required" });
    }

    let prompt = `You are CineGenie. Recommend 5 ${genre} movies for someone in a ${mood} mood.  
Return strictly as JSON array.`;

    const result = await model.generateContent(prompt);
    res.json({ response: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error generating dynamic response" });
  }
};
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPrompt = `
You are CineGenie, an AI movie recommendation assistant.
Role: Suggest movies tailored to the user’s request.
Task: Recommend 5 movies based on mood, favorite actor, or genre.
Format: Respond in JSON array with objects: { "title": "", "year": "", "description": "" }.
Context: The user will provide prompts such as "funny superhero movies like Deadpool" or "romantic dramas for a weekend night". 
Recommendations should be accurate, diverse, and engaging.
`;

const getRecommendations = async (req, res) => {
  try {
    const { prompt } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent([
      { role: "system", content: systemPrompt },
      { role: "user", content: `Recommend 5 movies for: ${prompt}` }
    ]);

    let recommendations;
    try {
      recommendations = JSON.parse(result.response.text());
    } catch {
      recommendations = [{ title: "Error", year: "", description: result.response.text() }];
    }

    res.json({ recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI recommendation failed" });
  }
};

module.exports = { getRecommendations, systemPrompt };

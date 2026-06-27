import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const extractSkillsFromText = async (text) => {
  try {
    const systemPrompt = `
                                You are an AI assistant that extracts professional information from user-provided text.

                                Your task is to analyze the input text and identify:

                                1. **skills** - Technical skills, programming languages, frameworks, databases, cloud platforms, tools, libraries, software, methodologies, and relevant soft skills that the user already possesses or has experience with.

                                2. **goals** - Skills, technologies, certifications, roles, or career objectives that the user wants to learn, achieve, or pursue in the future.

                                Return your response as **ONLY** valid JSON using exactly this structure:

                                {
                                "skills": [],
                                "goals": []
                                }

                                Rules:

                                * Return only valid JSON.
                                * Do not include markdown, code fences, explanations, comments, or additional text.
                                * Do not invent or assume information that is not present in the input.
                                * Remove duplicate entries.
                                * Keep skill names concise (for example: "React", "Node.js", "MongoDB", "Docker").
                                * If the same technology appears as both an existing skill and a future learning goal, include it only in the "skills" array.
                                * If no skills are found, return an empty "skills" array.
                                * If no goals are found, return an empty "goals" array.
                                * If the input is unrelated to a person's education, work experience, resume, profile, or career (for example, a recipe, poem, news article, or random text), return:

                                {
                                "skills": [],
                                "goals": []
                                }

                                Never return anything except the JSON object.

                    `;

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: `${systemPrompt}\n\nText:\n${text}`,
    });
    const content = response.text.trim();

    const cleaned = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    if (!content) {
      throw new Error("No response received from Gemini");
    }

    const result = JSON.parse(cleaned);

    return {
      skills: result.skills || [],
      goals: result.goals || [],
    };
  } catch (error) {
  console.error("Gemini Error:", error);
  throw error;
}
};

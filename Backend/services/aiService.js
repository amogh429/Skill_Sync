import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OpenAI_API_KEY,
});

export const extractSkillsFromText = async (text) => {
  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
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

                    `,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.2,
    });
    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No response received from OpenAI");
    }

    const result = JSON.parse(content);

    return {
      skills: result.skills || [],
      goals: result.goals || [],
    };
  } catch (error) {
    throw new Error(error.message || "Failed to extract skills and goals");
  }
};

import { extractSkillsFromText } from "../services/aiService.js";

export const extractSkills = async (req, res) => {
  try {
    const { text } = req.body;

    const extractedData = await extractSkillsFromText(text);

    // Return extracted skills and goals
    return res.status(200).json(extractedData);
  } catch (error) {
    console.error("Error extracting skills:", error);

    return res.status(500).json({
      message: "Failed to extract skills and goals.",
    });
  }
};

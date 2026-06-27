import { extractSkillsFromText } from "../services/aiService.js";

export const extractSkills = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      return res.status(400).json({
        error: "Invalid input",
        message: "Please provide text to extract skills from",
      });
    }

    if (text.trim().length < 10) {
      return res.status(400).json({
        error: "Text too short",
        message: "Please paste at least 10 characters of text",
      });
    }

    if (text.trim().length > 5000) {
      return res.status(400).json({
        error: "Text too long",
        message: "Maximum 5000 characters allowed",
      });
    }

    const extractedData = await extractSkillsFromText(text);

    // Return extracted skills and goals
    return res.status(200).json({
      skills: result.skills,
      learningGoals: result.learningGoals,
      message: `Extracted ${result.skills.length} skills and ${result.learningGoals.length} learning goals`,
    });
  } catch (error) {
    console.error("Error extracting skills:", error);

    return res.status(500).json({
      error: "Extraction failed",
      message:
        error.message ||
        "An error occurred while extracting skills. Please try again.",
    });
  }
};

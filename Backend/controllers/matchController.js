import User from "../models/User.js";

export const getMatches = async (req, res) => {
  try {
    // 1. Get logged-in user
    const currentUser = await User.findById(req.user._id);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Get other users with completed profiles
    const allUsers = await User.find({
      _id: { $ne: req.user._id },
      profileComplete: true,
    }).select("-password");

    // 3. Normalize current user data safely
    const mySkills = (currentUser.skills || []).map(s => s.toLowerCase());
    const myGoals = (currentUser.learningGoals || []).map(g => g.toLowerCase());

    // 4. Calculate scores
    const scoredUsers = allUsers.map((otherUser) => {

      const theirSkills = (otherUser.skills || []).map(s => s.toLowerCase());
      const theirGoals = (otherUser.learningGoals || []).map(g => g.toLowerCase());

      // Matches
      const youCanTeach = mySkills.filter(skill =>
        theirGoals.includes(skill)
      ).length;

      const theyCanTeach = theirSkills.filter(skill =>
        myGoals.includes(skill)
      ).length;

      // Optional availability bonus
      const availabilityBonus =
        currentUser.availability && otherUser.availability &&
        currentUser.availability === otherUser.availability
          ? 1
          : 0;

      // Score
      const rawScore = youCanTeach + theyCanTeach + availabilityBonus;

      // Max possible score
      const maxScore = mySkills.length + theirSkills.length + 1;

      const compatibilityPercent =
        maxScore > 0
          ? Math.round((rawScore / maxScore) * 100)
          : 0;

      return {
        user: otherUser,
        youCanTeach,
        theyCanTeach,
        compatibilityPercent,
      };
    });

    // 5. Filter + sort
    const matches = scoredUsers
      .filter(match => match.compatibilityPercent > 0)
      .sort((a, b) => b.compatibilityPercent - a.compatibilityPercent);

    // 6. Return result
    res.status(200).json(matches);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

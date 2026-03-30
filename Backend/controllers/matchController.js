import User from "../models/User.js";

export const getRecommendedUsers = async (req, res) => {
  try {
    // Get logged user
    const loggedUser = await User.findById(req.user._id).select("-password");

    if (!loggedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get other users
    const users = await User.find({
      _id: { $ne: req.user._id },
      profileComplete: true,
    }).select("-password");

    // Prepare result array
    const recommendedUsers = [];

    // 🔁 Loop through users
    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      // Count youCanTeach
      const youCanTeach = (loggedUser.skills || []).filter((skill) =>
        (user.learningGoals || []).includes(skill)
      ).length;

      // Count theyCanTeach
      const theyCanTeach = (user.skills || []).filter((skill) =>
        (loggedUser.learningGoals || []).includes(skill)
      ).length;

      // Calculate score
      const score = youCanTeach + theyCanTeach;

      // Only include meaningful matches
      if (score > 0) {
        recommendedUsers.push({
          user,
          score,
        });
      }
    }

    // Sort by best match
    recommendedUsers.sort((a, b) => b.score - a.score);

    // Send response
    res.status(200).json(recommendedUsers);

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

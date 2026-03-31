import User from '../models/User.js';


// GET /api/users/profile
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
    
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// PUT /api/users/profile
export const updateProfile = async (req, res) => {
  try {
    const { bio, skills, learningGoals, availability } = req.body;

    // 1. Get existing user
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Update only provided fields
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) user.skills = skills;
    if (learningGoals !== undefined) user.learningGoals = learningGoals;
    if (availability !== undefined) user.availability = availability;

    // 3. Check if profile is complete (AFTER updating fields)
    if (
      user.bio &&
      user.skills?.length > 0 &&
      user.learningGoals?.length > 0 &&
      user.availability
    ) {
      user.profileComplete = true;
    }

    // 4. Save updated user
    await user.save();

    // 5. Return updated user (without password)
    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.status(200).json(updatedUser);

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET /api/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
      profileComplete: true
    }).select('-password');

    res.status(200).json(users); 

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/users/:id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

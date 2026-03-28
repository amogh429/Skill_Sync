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
export const updateProfile = async (req,res) => {
  try{
    const { bio , skills , learningGoals , availability } = req.body;

    // Build update object with only provided fields
    const updateFields = {};
    if(bio !=  undefined) updateFields.bio = bio;
    if(skills != undefined) updateFields.skills = skills;
    if(learningGoals != undefined) updateFields.learningGoals = learningGoals;
    if(availability != undefined) updateFields.availability = availability;

    // Check if profile is complete
    if(
      updateFields.bio &&
      updateFields.skills &&
      updateFields.availability &&
      updateFields.learningGoals
    ) {
      updateFields.profileComplete = true;
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields},
      { returnDocument: 'after'}
    ).select('-password');
    if (!updatedUser){
      return res.status(404).json({message: 'User not found'});
    }
    
    res.status(200).json(updatedUser);

  } catch(error){
    res.status(500).json({message: 'Server error', error: error.message});
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

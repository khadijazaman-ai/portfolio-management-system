const User = require('../models/User');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// GET current user's profile or unauthenticated guest fallback
exports.getProfile = async (req, res) => {
  try {
    // Check if auth token is present
    let userId = req.user;
    if (!userId) {
      const authHeader = req.header('Authorization');
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        if (token) {
          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            userId = decoded.id;
          } catch (e) {}
        }
      }
    }

    if (userId) {
      // Authenticated view - return user details directly
      const user = await User.findById(userId).select('-password');
      if (user) {
        return res.json(user);
      }
    }

    // Unauthenticated guest view - fallback to first user in database
    const user = await User.findOne().select('-password');
    if (!user) {
      return res.status(404).json({ message: 'No profile found in database' });
    }

    const skills = await Skill.find({ user: user._id });
    const projects = await Project.find({ user: user._id });

    res.json({
      user,
      skills,
      projects
    });
  } catch (err) {
    console.error('getProfile error:', err);
    res.status(500).json({ message: 'Server error fetching profile details' });
  }
};

// PUT update profile (general endpoint)
exports.updateProfile = async (req, res) => {
  try {
    const { name, about, role, tagline, location, phone, linkedin, github, website, education, careerGoals, interests } = req.body;
    
    const updates = { 
      name, about, role, tagline, location, phone, 
      linkedin, github, website, education, careerGoals, interests 
    };

    // Clean undefined fields
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const user = await User.findByIdAndUpdate(
      req.user,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Log Activity
    await new Activity({
      user: req.user,
      action: 'Updated Profile',
      details: 'Profile information was updated.'
    }).save();

    // Create Notification
    await new Notification({
      user: req.user,
      message: 'Your profile details were updated successfully.'
    }).save();

    res.json(user);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error updating profile info' });
  }
};

// PUT update about details
exports.updateProfileAbout = async (req, res) => {
  try {
    const { about, education, careerGoals, interests } = req.body;
    const updates = { about, education, careerGoals, interests };

    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const user = await User.findByIdAndUpdate(
      req.user,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await new Activity({
      user: req.user,
      action: 'Updated Profile',
      details: 'Updated biography & education.'
    }).save();

    res.json(user);
  } catch (err) {
    console.error('Update profile about error:', err);
    res.status(500).json({ message: 'Server error updating about section' });
  }
};

// PUT update contact details
exports.updateProfileContact = async (req, res) => {
  try {
    const { email, phone, location } = req.body;
    const updates = { email, phone, location };

    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const user = await User.findByIdAndUpdate(
      req.user,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await new Activity({
      user: req.user,
      action: 'Updated Profile',
      details: 'Updated contact details.'
    }).save();

    res.json(user);
  } catch (err) {
    console.error('Update profile contact error:', err);
    res.status(500).json({ message: 'Server error updating contact details' });
  }
};

// PUT update social details
exports.updateProfileSocial = async (req, res) => {
  try {
    const { linkedin, github, website } = req.body;
    const updates = { linkedin, github, website };

    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const user = await User.findByIdAndUpdate(
      req.user,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await new Activity({
      user: req.user,
      action: 'Updated Profile',
      details: 'Updated social links.'
    }).save();

    res.json(user);
  } catch (err) {
    console.error('Update profile social error:', err);
    res.status(500).json({ message: 'Server error updating social links' });
  }
};

// POST upload profile image
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete old local file if it exists
    if (user.profileImage && user.profileImage.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, '..', user.profileImage);
      if (fs.existsSync(oldPath)) {
        fs.unlink(oldPath, err => {
          if (err) console.error('Failed to delete old avatar:', err);
        });
      }
    }

    const imageUrl = `/uploads/profiles/${req.file.filename}`;
    user.profileImage = imageUrl;
    await user.save();

    // Log Activity
    await new Activity({
      user: req.user,
      action: 'Updated Profile Picture',
      details: 'Profile avatar was updated.'
    }).save();

    // Create Notification
    await new Notification({
      user: req.user,
      message: 'Profile picture changed successfully.'
    }).save();

    res.json({
      message: 'Profile picture uploaded successfully',
      imageUrl
    });
  } catch (err) {
    console.error('Upload profile image error:', err);
    res.status(500).json({ message: 'Server error uploading profile picture' });
  }
};

const router = require('express').Router();
const User = require('../models/User');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const auth = require('../middleware/authMiddleware');

// GET portfolio info (Authenticated)
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Fetch portfolio error:', err);
    res.status(500).json({ message: 'Server error fetching portfolio' });
  }
});

// UPDATE portfolio info (Authenticated)
router.put('/', auth, async (req, res) => {
  try {
    const { name, about, role, location, phone, linkedin, github, website } = req.body;
    
    // Create update object with allowed fields
    const updates = { name, about, role, location, phone, linkedin, github, website };
    
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

    res.json(user);
  } catch (err) {
    console.error('Update portfolio error:', err);
    res.status(500).json({ message: 'Server error updating portfolio' });
  }
});

// GET public portfolio view (Unauthenticated)
router.get('/public/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Fetch user details without password
    const user = await User.findById(userId).select('-password'); 
    if (!user) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    // Fetch user's skills and projects
    const skills = await Skill.find({ user: userId });
    const projects = await Project.find({ user: userId });

    res.json({
      user,
      skills,
      projects
    });
  } catch (err) {
    console.error('Fetch public portfolio error:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Invalid portfolio ID' });
    }
    res.status(500).json({ message: 'Server error fetching public portfolio' });
  }
});

module.exports = router;
